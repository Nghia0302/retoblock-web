(() => {
  const BRIDGE_URL = 'http://127.0.0.1:32123';
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

  async function bridgeRequest(path, options = {}) {
    const response = await fetch(`${BRIDGE_URL}${path}`, {
      cache: 'no-store',
      ...options
    });
    if (!response.ok) {
      let message = `Retoblock Uploader trả về lỗi ${response.status}.`;
      try {
        const data = await response.json();
        if (data.message) message = data.message;
      } catch (_) {
        // Giữ thông báo mặc định nếu phản hồi không phải JSON.
      }
      throw new Error(message);
    }
    return response;
  }

  async function listBridgePorts() {
    try {
      const response = await bridgeRequest('/ports', { signal: AbortSignal.timeout(4000) });
      const data = await response.json();
      return Array.isArray(data.ports) ? data.ports : [];
    } catch (_) {
      return [];
    }
  }

  async function uploadThroughBridge(code, port) {
    try {
      const response = await bridgeRequest('/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, port })
      });
      if (!response.body) throw new Error('Trình duyệt không đọc được tiến độ nạp code.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let result = null;

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          const message = JSON.parse(line);
          if (message.type === 'progress') callbacks.uploadProgress?.(message);
          if (message.type === 'result') result = message;
        }
        if (done) break;
      }

      if (buffer.trim()) {
        const message = JSON.parse(buffer);
        if (message.type === 'result') result = message;
      }
      return result || { success: false, message: 'Không nhận được kết quả từ VS Code.' };
    } catch (error) {
      return {
        success: false,
        message: `Không kết nối được Retoblock Uploader trong VS Code. Hãy mở VS Code, cài PlatformIO và extension Retoblock Uploader.\n\n${error.message}`
      };
    }
  }

  async function updateBridgeStatus() {
    const status = document.getElementById('bridge-status');
    if (!status) return;
    try {
      const response = await bridgeRequest('/health', { signal: AbortSignal.timeout(2500) });
      const data = await response.json();
      status.textContent = data.platformio
        ? 'VS Code + PlatformIO đã kết nối'
        : 'Đã kết nối VS Code · chưa thấy PlatformIO';
    } catch (_) {
      status.textContent = 'Mở VS Code để kết nối PlatformIO';
    }
  }

  window.electronAPI = {
    isWeb: true,
    supportsCodeUpload: true,
    sendCodeToESP32: uploadThroughBridge,
    getSerialPorts: listBridgePorts,
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
    fileInput?.addEventListener('change', async () => {
      const [file] = fileInput.files;
      if (file) await readProjectFile(file);
      fileInput.value = '';
    });

    document.getElementById('new-project-btn')?.addEventListener('click', () => callbacks.newProject?.());
    document.getElementById('open-project-btn')?.addEventListener('click', openProjectPicker);
    document.getElementById('save-as-project-btn')?.addEventListener('click', () => callbacks.saveProjectAs?.());
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

    updateBridgeStatus();
    setInterval(updateBridgeStatus, 5000);
  });
})();
