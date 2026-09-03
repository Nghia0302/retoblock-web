const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('id="device-selector" class="device-selector-container" style="display: none;"', 'id="device-selector" class="device-selector-container"');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed display in index.html');
