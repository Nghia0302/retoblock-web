const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

const target = `<style>
    body {`;

const replace = `<style>
    /* Device Selector for Blockly */
    .device-selector-container {
      position: absolute;
      bottom: 20px;
      left: 10px;
      z-index: 1000;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 140px;
    }
    .device-btn {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f9f9f9;
      cursor: pointer;
      text-align: left;
      font-weight: bold;
      color: #333;
    }
    .device-btn.active {
      background: #4C97FF;
      color: white;
      border-color: #3373cc;
    }
    .device-btn.disabled {
      color: #999;
      cursor: not-allowed;
    }
    .device-label {
      font-size: 12px;
      color: #666;
      margin-bottom: -4px;
    }
    body {`;

content = content.replace(target, replace);
fs.writeFileSync(path, content, 'utf8');
console.log('index.html CSS updated');
