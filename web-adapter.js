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

  const projectPickerOptions = {
    types: [{
      description: 'Dự án RETOBLOCK',
      accept: {
        'text/html': ['.html'],
        'application/x-retoblock': ['.retoblock'],
        'application/xml': ['.xml']
      }
    }],
    excludeAcceptAllOption: false
  };

  const savePickerOptions = {
    types: [{
      description: 'Dự án RETOBLOCK mở trên web',
      accept: { 'text/html': ['.html'] }
    }],
    excludeAcceptAllOption: false
  };

  function encodeProject(xmlText) {
    const bytes = new TextEncoder().encode(xmlText);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function decodeProject(encoded) {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function buildWebProjectFile(xmlText) {
    const projectData = encodeProject(xmlText);
    const appUrl = new URL('./', window.location.href).href;
    return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Dự án RETOBLOCK</title>
</head>
<body>
  <p>Đang mở dự án RETOBLOCK trên web...</p>
  <script id="retoblock-project-data" type="application/x-retoblock">${projectData}</script>
  <script>
    location.replace(${JSON.stringify(appUrl)} + '#project=' + document.getElementById('retoblock-project-data').textContent.trim());
  </script>
</body>
</html>`;
  }

  function projectXmlFromHtml(htmlText) {
    const match = htmlText.match(/<script[^>]+id=["']retoblock-project-data["'][^>]*>([\s\S]*?)<\/script>/i);
    if (!match) throw new Error('File HTML này không chứa dự án RETOBLOCK.');
    return decodeProject(match[1].trim());
  }

  async function readProjectFile(file, handle = null) {
    const fileText = await file.text();
    const xmlText = file.name.toLowerCase().endsWith('.html')
      ? projectXmlFromHtml(fileText)
      : fileText;
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

  function downloadFallback(htmlText, fileName) {
    const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
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
      const htmlText = buildWebProjectFile(xmlText);
      if ('showSaveFilePicker' in window) {
        if (!currentFileHandle || forceNewFile) {
          currentFileHandle = await window.showSaveFilePicker({
            ...savePickerOptions,
            suggestedName: 'du-an-retoblock.html'
          });
        }
        const writable = await currentFileHandle.createWritable();
        await writable.write(htmlText);
        await writable.close();
        return { success: true, filePath: currentFileHandle.name };
      }

      downloadFallback(htmlText, 'du-an-retoblock.html');
      return { success: true, filePath: 'du-an-retoblock.html' };
    } catch (error) {
      if (error.name === 'AbortError') return { success: false };
      return { success: false, error: error.message };
    }
  }

  window.electronAPI = {
    isWeb: true,
    supportsCodeUpload: false,
    sendCodeToESP32: async () => ({
      success: false,
      message: 'Bản web chưa có máy chủ biên dịch ESP32 nên chưa thể nạp code trực tiếp.'
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
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
    }

    if ('caches' in window) {
      caches.keys().then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('retoblock-web-')).map((key) => caches.delete(key))
      ));
    }

    const encodedProject = new URLSearchParams(window.location.hash.slice(1)).get('project');
    if (encodedProject) {
      try {
        callbacks.openProject?.({ xmlText: decodeProject(encodedProject), filePath: 'du-an-retoblock.html' });
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (error) {
        callbacks.projectError?.(`Không thể mở dự án từ file HTML: ${error.message}`);
      }
    }
  });
})();
