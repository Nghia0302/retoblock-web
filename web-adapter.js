(() => {
  const callbacks = {
    newProject: null,
    openProject: null,
    saveProject: null,
    saveProjectAs: null,
    projectError: null,
    uploadProgress: null
  };

  let currentFileHandle = null;
  let installPrompt = null;

  const projectPickerOptions = {
    types: [{
      description: 'Dự án RETOBLOCK',
      accept: {
        'application/x-retoblock': ['.retoblock'],
        'application/xml': ['.xml']
      }
    }],
    excludeAcceptAllOption: false
  };

  async function readProjectFile(file, handle = null) {
    const xmlText = await file.text();
    currentFileHandle = handle;
    if (callbacks.openProject) {
      callbacks.openProject({ xmlText, filePath: file.name });
    }
  }

  async function openProjectPicker() {
    try {
      if ('showOpenFilePicker' in window) {
        const [handle] = await window.showOpenFilePicker(projectPickerOptions);
        await readProjectFile(await handle.getFile(), handle);
        return;
      }
      document.getElementById('project-file-input').click();
    } catch (error) {
      if (error.name !== 'AbortError' && callbacks.projectError) {
        callbacks.projectError(`Không thể mở dự án: ${error.message}`);
      }
    }
  }

  function downloadFallback(xmlText, fileName) {
    const blob = new Blob([xmlText], { type: 'application/x-retoblock;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  async function writeProjectFile(xmlText, forceNewFile = false) {
    try {
      if ('showSaveFilePicker' in window) {
        if (!currentFileHandle || forceNewFile) {
          currentFileHandle = await window.showSaveFilePicker({
            ...projectPickerOptions,
            suggestedName: 'du-an-retoblock.retoblock'
          });
        }
        const writable = await currentFileHandle.createWritable();
        await writable.write(xmlText);
        await writable.close();
        return { success: true, filePath: currentFileHandle.name };
      }

      downloadFallback(xmlText, 'du-an-retoblock.retoblock');
      return { success: true, filePath: 'du-an-retoblock.retoblock' };
    } catch (error) {
      if (error.name === 'AbortError') return { success: false };
      return { success: false, error: error.message };
    }
  }

  window.electronAPI = {
    isWeb: true,
    sendCodeToESP32: async () => ({
      success: false,
      message: 'Bản web hiện dùng để soạn và lưu dự án. Hãy dùng bản desktop để nạp code vào robot.'
    }),
    getSerialPorts: async () => [],
    saveWorkspace: async (xmlText) => {
      localStorage.setItem('retoblock-workspace', xmlText);
      return { success: true };
    },
    loadWorkspace: async () => {
      const xmlText = localStorage.getItem('retoblock-workspace');
      return xmlText ? { success: true, xmlText } : { success: false };
    },
    saveProjectFile: async (xmlText) => writeProjectFile(xmlText, false),
    saveProjectFileAs: async (xmlText) => writeProjectFile(xmlText, true),
    onNewProject: (callback) => { callbacks.newProject = callback; },
    onOpenProject: (callback) => { callbacks.openProject = callback; },
    onSaveProject: (callback) => { callbacks.saveProject = callback; },
    onSaveProjectAs: (callback) => { callbacks.saveProjectAs = callback; },
    onProjectError: (callback) => { callbacks.projectError = callback; },
    onUploadProgress: (callback) => { callbacks.uploadProgress = callback; }
  };

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    document.getElementById('install-app-btn')?.removeAttribute('hidden');
  });

  window.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('project-file-input');
    fileInput.addEventListener('change', async () => {
      const [file] = fileInput.files;
      if (file) await readProjectFile(file);
      fileInput.value = '';
    });

    document.getElementById('new-project-btn').addEventListener('click', () => callbacks.newProject?.());
    document.getElementById('open-project-btn').addEventListener('click', openProjectPicker);
    document.getElementById('save-project-btn').addEventListener('click', () => callbacks.saveProject?.());
    document.getElementById('save-as-project-btn').addEventListener('click', () => callbacks.saveProjectAs?.());
    document.getElementById('install-app-btn').addEventListener('click', async () => {
      if (!installPrompt) return;
      await installPrompt.prompt();
      installPrompt = null;
      document.getElementById('install-app-btn').setAttribute('hidden', '');
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js', { scope: './' });
    }
  });

  if ('launchQueue' in window) {
    window.launchQueue.setConsumer(async (launchParams) => {
      const [handle] = launchParams.files || [];
      if (handle) await readProjectFile(await handle.getFile(), handle);
    });
  }
})();
