const fs = require('fs');
let path = 'renderer.js';
let content = fs.readFileSync(path, 'utf8');

const target1 = `Blockly.defineBlocksWithJsonArray([`;

const replace1 = `Blockly.defineBlocksWithJsonArray([
  {
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
  },`;

if (!content.includes('"type": "esp32_servo"')) {
    content = content.replace(target1, replace1);
    fs.writeFileSync(path, content, 'utf8');
    console.log('renderer.js updated with json blocks');
} else {
    console.log('already exists');
}
