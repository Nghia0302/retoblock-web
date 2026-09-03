const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

const target = `<div id="blocklyDiv"></div>`;

const replace = `<div id="blocklyDiv"></div>

  <!-- Device Selector Panel (Floating above toolbox) -->
  <div id="device-selector" class="device-selector-container" style="display: none;">
    <div class="device-label">Thiết bị</div>
    <button class="device-btn active" id="btn-dev-retobot">RetoBot</button>
    <button class="device-btn disabled" id="btn-dev-retobot2" onclick="alert('RetoBot 2.0 sắp ra mắt!')">RetoBot 2.0</button>
  </div>
`;

content = content.replace(target, replace);
fs.writeFileSync(path, content, 'utf8');
console.log('index.html HTML updated');
