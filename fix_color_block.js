const fs = require('fs');
let path = 'renderer.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add block definition
const blockDefTarget = `{
      "type": "esp32_read_color",
      "message0": "Đọc màu từ Cảm biến màu TCS34725",
      "output": "String",
      "colour": "#FF8C00",
      "tooltip": "Nhận diện màu: RED, GREEN, BLUE, YELLOW, WHITE, UNKNOWN"
    }`;

const blockDefReplace = `{
      "type": "esp32_read_color",
      "message0": "Đọc màu từ Cảm biến màu TCS34725",
      "output": "String",
      "colour": "#FF8C00",
      "tooltip": "Nhận diện màu: RED, GREEN, BLUE, YELLOW, WHITE, UNKNOWN"
    },
    {
      "type": "esp32_check_color",
      "message0": "Cảm biến màu phát hiện màu %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "COLOR",
          "options": [
            ["Đỏ (Red)", "RED"],
            ["Xanh lá (Green)", "GREEN"],
            ["Xanh dương (Blue)", "BLUE"],
            ["Vàng (Yellow)", "YELLOW"],
            ["Trắng (White)", "WHITE"]
          ]
        }
      ],
      "output": "Boolean",
      "colour": "#FF8C00",
      "tooltip": "Kiểm tra xem cảm biến có đang phát hiện màu đã chọn hay không"
    }`;

content = content.replace(blockDefTarget, blockDefReplace);

// 2. Add block generator
const genTarget = `Blockly.JavaScript.forBlock['esp32_read_color'] = function(block) {
  return ['readColorSensor()', Blockly.JavaScript.ORDER_ATOMIC];
};`;

const genReplace = `Blockly.JavaScript.forBlock['esp32_read_color'] = function(block) {
  return ['readColorSensor()', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['esp32_check_color'] = function(block) {
  const color = block.getFieldValue('COLOR');
  return ['(readColorSensor() == "' + color + '")', Blockly.JavaScript.ORDER_EQUALITY];
};`;

content = content.replace(genTarget, genReplace);

fs.writeFileSync(path, content, 'utf8');
console.log('Added esp32_check_color to renderer.js');
