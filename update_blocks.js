const fs = require('fs');
let path = 'renderer.js';
let content = fs.readFileSync(path, 'utf8');

const target1 = `  {
    "type": "esp32_start",`;

const replace1 = `  {
    "type": "esp32_servo",
    "message0": "Nâng hạ cần bằng Servo góc %1 độ",
    "args0": [
      {
        "type": "field_number",
        "name": "ANGLE",
        "value": 90,
        "min": 0,
        "max": 180
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "Điều khiển Servo quay từ 0 đến 180 độ.",
    "helpUrl": ""
  },
  {
    "type": "esp32_read_color",
    "message0": "Đọc cảm biến màu sắc",
    "output": "String",
    "colour": 290,
    "tooltip": "Trả về tên màu sắc nhận diện được (ví dụ: RED, BLUE, GREEN).",
    "helpUrl": ""
  },
  {
    "type": "esp32_start",`;

content = content.replace(target1, replace1);

const target2 = `Blockly.JavaScript.forBlock['math_change'] = function (block) {`;

const replace2 = `Blockly.JavaScript.forBlock['esp32_servo'] = function(block) {
  const angle = block.getFieldValue('ANGLE');
  return '  writeServoAngle(' + angle + ');\\n';
};

Blockly.JavaScript.forBlock['esp32_read_color'] = function(block) {
  return ['colorSensor.getColorName()', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['math_change'] = function (block) {`;

content = content.replace(target2, replace2);
fs.writeFileSync(path, content, 'utf8');
console.log('renderer.js updated');

path = 'index.html';
content = fs.readFileSync(path, 'utf8');

const target3 = `<xml id="toolbox" style="display: none">`;

const replace3 = `<xml id="toolbox" style="display: none">
    <category name="Mở rộng 2.0" colour="#ff5722" id="cat_retobot2" style="display: none;">
      <block type="esp32_servo"></block>
      <block type="esp32_read_color"></block>
    </category>`;

content = content.replace(target3, replace3);

const target4 = `  <!-- Device Selector Panel (Floating above toolbox) -->
  <div id="device-selector" class="device-selector-container">
    <div class="device-label">Thiết bị</div>
    <button class="device-btn active" id="btn-dev-retobot">RetoBot</button>
    <button class="device-btn disabled" id="btn-dev-retobot2" onclick="alert('RetoBot 2.0 sắp ra mắt!')">RetoBot 2.0</button>
  </div>`;

const replace4 = `  <!-- Device Selector Panel (Floating above toolbox) -->
  <div id="device-selector" class="device-selector-container">
    <div class="device-label">Thiết bị</div>
    <button class="device-btn active" id="btn-dev-retobot" onclick="switchDevice('retobot')">RetoBot</button>
    <button class="device-btn" id="btn-dev-retobot2" onclick="switchDevice('retobot2')">RetoBot 2.0</button>
  </div>
  <script>
    function switchDevice(device) {
      document.getElementById('btn-dev-retobot').classList.remove('active');
      document.getElementById('btn-dev-retobot2').classList.remove('active');
      document.getElementById('btn-dev-' + device).classList.add('active');
      
      const toolbox = document.getElementById('toolbox');
      const cat2 = document.getElementById('cat_retobot2');
      if (device === 'retobot2') {
        cat2.style.display = 'block';
      } else {
        cat2.style.display = 'none';
      }
      if (typeof workspace !== 'undefined') {
        workspace.updateToolbox(toolbox);
      }
    }
  </script>`;

content = content.replace(target4, replace4);
fs.writeFileSync(path, content, 'utf8');
console.log('index.html updated');
