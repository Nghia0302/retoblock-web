// 0. ĐĂNG KÝ HÀM BẢNG MÀU CHỈNH MÀU SẮC (FIELD_COLOUR) CHO BLOCKLY
class CustomFieldColour extends Blockly.Field {
  constructor(value, validator, config) {
    super(value || '#ff0000', validator, config);
    this.SERIALIZABLE = true;
  }

  static fromJson(options) {
    return new CustomFieldColour(options['colour'] || options['value'] || '#ff0000');
  }

  initView() {
    this.size_ = new Blockly.utils.Size(26, 26);
    this.borderRect_ = Blockly.utils.dom.createSvgElement(
      'rect',
      {
        'rx': 6,
        'ry': 6,
        'x': 0,
        'y': 0,
        'width': 26,
        'height': 26,
        'stroke': '#ffffff',
        'stroke-width': '2px',
        'cursor': 'pointer'
      },
      this.fieldGroup_
    );
    this.applyColour();
    this.updateEditable();
  }

  applyColour() {
    if (this.borderRect_) {
      const color = this.getValue() || '#ff0000';
      this.borderRect_.setAttribute('fill', color);
      if (this.borderRect_.style) {
        this.borderRect_.style.setProperty('fill', color, 'important');
      }
    }
  }

  doValueUpdate_(newValue) {
    super.doValueUpdate_(newValue);
    this.applyColour();
  }

  dispose() {
    if (Blockly && Blockly.DropDownDiv) {
      Blockly.DropDownDiv.hideIfOwner(this);
    }
    super.dispose();
  }

  showEditor_() {
    if (!Blockly || !Blockly.DropDownDiv) return;

    Blockly.DropDownDiv.hideWithoutAnimation();
    Blockly.DropDownDiv.clearContent();
    Blockly.DropDownDiv.setColour('#ffffff', '#dcdcdc');

    const contentDiv = Blockly.DropDownDiv.getContentDiv();

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.padding = '8px';
    container.style.fontFamily = 'Segoe UI, sans-serif';

    const presetsTitle = document.createElement('div');
    presetsTitle.innerText = 'Chọn màu sắc:';
    presetsTitle.style.fontSize = '13px';
    presetsTitle.style.fontWeight = 'bold';
    presetsTitle.style.color = '#333';
    container.appendChild(presetsTitle);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    grid.style.gap = '8px';

    const colors = [
      '#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00ffff',
      '#0000ff', '#8b00ff', '#ff00ff', '#ffffff'
    ];

    colors.forEach(c => {
      const btn = document.createElement('div');
      btn.style.width = '26px';
      btn.style.height = '26px';
      btn.style.borderRadius = '50%';
      btn.style.backgroundColor = c;
      btn.style.border = '2px solid #ccc';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'transform 0.1s';
      btn.onmouseover = () => btn.style.transform = 'scale(1.15)';
      btn.onmouseout = () => btn.style.transform = 'scale(1)';
      btn.onclick = () => {
        this.setValue(c);
        Blockly.DropDownDiv.hideIfOwner(this);
      };
      grid.appendChild(btn);
    });
    container.appendChild(grid);

    const customRow = document.createElement('label');
    customRow.style.display = 'flex';
    customRow.style.alignItems = 'center';
    customRow.style.gap = '8px';
    customRow.style.cursor = 'pointer';
    customRow.style.fontSize = '12px';
    customRow.style.color = '#555';
    customRow.style.marginTop = '4px';

    const inputColor = document.createElement('input');
    inputColor.type = 'color';
    inputColor.value = this.getValue() || '#ff0000';
    inputColor.style.width = '32px';
    inputColor.style.height = '32px';
    inputColor.style.border = 'none';
    inputColor.style.borderRadius = '6px';
    inputColor.style.cursor = 'pointer';

    inputColor.oninput = (e) => {
      this.setValue(e.target.value);
    };

    customRow.appendChild(inputColor);
    customRow.appendChild(document.createTextNode('Bảng màu tùy chỉnh...'));
    container.appendChild(customRow);

    contentDiv.appendChild(container);

    Blockly.DropDownDiv.showPositionedByField(this, () => {
      // Callback khi đóng bảng chọn màu
    });
  }
}

if (Blockly && Blockly.fieldRegistry) {
  Blockly.fieldRegistry.register('field_colour', CustomFieldColour);
}

// Ghi đè hàm tạo mũi tên xổ xuống cho FieldDropdown để dùng SVG Path trực tiếp, khắc phục triệt để lỗi hiển thị icon ảnh [img]
if (Blockly && Blockly.FieldDropdown) {
  Blockly.FieldDropdown.prototype.createSVGArrow_ = function() {
    this.svgArrow = Blockly.utils.dom.createSvgElement(
      'path',
      {
        'd': 'M 1 3 L 6 8 L 11 3 Z',
        'fill': '#ffffff',
        'opacity': '0.9',
        'cursor': 'pointer'
      },
      this.fieldGroup_
    );
  };
}

// 1. ĐỊNH NGHĨA HÌNH DÁNG KHỐI BẰNG JSON ĐỂ ĐẢM BẢO CHUẨN XÁC
Blockly.defineBlocksWithJsonArray([
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
  },
  {
    "type": "esp32_start",
    "message0": "Khởi động Robot %1 Thực hiện %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "colour": 210,
    "tooltip": "Khối bắt đầu chương trình. Đặt các khối lệnh vào bên trong.",
    "helpUrl": ""
  },
  {
    "type": "esp32_digital_write",
    "message0": "Đổi trạng thái chân GPIO %1 thành %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "PIN",
        "options": [
          ["2", "2"],
          ["4", "4"],
          ["5", "5"],
          ["18", "18"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "STATE",
        "options": [
          ["BẬT", "HIGH"],
          ["TẮT", "LOW"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160,
    "tooltip": "Bật hoặc Tắt một chân tín hiệu trên ESP32",
    "helpUrl": ""
  },
  {
    "type": "retocar_move_car",
    "message0": "%1 với công suất %2 (%)",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIR",
        "options": [
          ["chạy tới", "FORWARD"],
          ["chạy lui", "BACKWARD"],
          ["rẽ trái", "LEFT"],
          ["rẽ phải", "RIGHT"]
        ]
      },
      {
        "type": "field_number",
        "name": "SPEED",
        "value": 50,
        "min": 0,
        "max": 100
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Xe di chuyển theo hướng được chọn."
  },
  {
    "type": "retocar_move_individual_wheel",
    "message0": "Bánh xe %1 chạy %2 với công suất %3 (%)",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "WHEEL",
        "options": [
          ["Trái", "LEFT"],
          ["Phải", "RIGHT"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "DIR",
        "options": [
          ["Tới", "FORWARD"],
          ["Lui", "BACKWARD"]
        ]
      },
      {
        "type": "field_number",
        "name": "SPEED",
        "value": 50,
        "min": 0,
        "max": 100
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Điều khiển độc lập bánh xe Trái hoặc Phải."
  },
  {
    "type": "retocar_stop",
    "message0": "dừng",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF",
    "tooltip": "Dừng xe"
  },
  {
    "type": "retocar_wait",
    "message0": "chờ %1 giây",
    "args0": [
      {
        "type": "field_number",
        "name": "TIME",
        "value": 1,
        "min": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Tạm dừng chương trình"
  },
  {
    "type": "retocar_set_rgb",
    "message0": "bật đèn RGB với màu %1",
    "args0": [
      {
        "type": "field_colour",
        "name": "COLOR",
        "colour": "#ff0000"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#8A2BE2",
    "tooltip": "Đổi màu đèn RGB."
  },
  {
    "type": "retocar_led_control",
    "message0": "đèn pha %1 trạng thái %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "SIDE",
        "options": [
          ["tất cả", "0"],
          ["trái", "1"],
          ["phải", "2"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "STATE",
        "options": [
          ["bật", "1"],
          ["tắt", "0"]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#8A2BE2",
    "tooltip": "Bật/Tắt đèn pha trái/phải không dừng chương trình"
  },
  {
    "type": "retocar_buzzer_control",
    "message0": "phát âm thanh tần số %1 Hz",
    "args0": [
      {
        "type": "field_number",
        "name": "FREQ",
        "value": 700,
        "min": 0
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#8A2BE2",
    "tooltip": "Phát âm thanh tần số tùy chỉnh liên tục không dừng chương trình"
  },
  {
    "type": "retocar_buzzer_stop",
    "message0": "tắt âm thanh",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#8A2BE2",
    "tooltip": "Tắt âm thanh còi"
  },
  {
    "type": "retocar_sensor_light",
    "message0": "cường độ ánh sáng",
    "output": "Number",
    "colour": "#36b5d8",
    "tooltip": "Đọc giá trị cường độ ánh sáng của cảm biến quang trở."
  },
  {
    "type": "retocar_sensor_ultrasonic",
    "message0": "khoảng cách tới vật cản gần nhất (cm)",
    "output": "Number",
    "colour": "#36b5d8",
    "tooltip": "Đọc khoảng cách từ cảm biến siêu âm."
  },
  {
    "type": "retocar_sensor_line",
    "message0": "%1 đường line ở mắt %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "VAL",
        "options": [
          ["có", "1"],
          ["không", "0"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "PORT",
        "options": [
          ["Trái", "23"],
          ["Giữa", "16"],
          ["Phải", "17"]
        ]
      }
    ],
    "output": "Boolean",
    "colour": "#36b5d8",
    "tooltip": "Đọc trạng thái phát hiện vạch đen từ cảm biến line."
  },
  {
    "type": "retocar_sensor_button",
    "message0": "nút nhấn %1 đang được %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "BUTTON",
        "options": [
          ["1", "35"],
          ["2", "34"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "STATE",
        "options": [
          ["nhấn", "0"],
          ["nhả", "1"]
        ]
      }
    ],
    "output": "Boolean",
    "colour": "#36b5d8",
    "tooltip": "Kiểm tra trạng thái nút nhấn trên bo"
  },
  {
    "type": "retocar_event_button",
    "message0": "khi nút %1 trên board %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "BUTTON",
        "options": [
          ["1", "35"],
          ["2", "34"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "STATE",
        "options": [
          ["được nhấn", "0"],
          ["được nhả", "1"]
        ]
      }
    ],
    "nextStatement": null,
    "colour": "#FFBF00",
    "tooltip": "Thực thi lệnh khi nút được nhấn/nhả"
  },
  {
    "type": "retocar_timer_get",
    "message0": "Thời gian hiện tại",
    "output": "Number",
    "colour": "#36b5d8",
    "tooltip": "Lấy thời gian hiện tại của đồng hồ (giây)"
  },
  {
    "type": "retocar_timer_reset",
    "message0": "Đặt lại đồng hồ",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#36b5d8",
    "tooltip": "Đưa bộ đếm thời gian về 0"
  },
  {
    "type": "retocar_if",
    "message0": "nếu %1 thì %2",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Nếu điều kiện đúng thì thực hiện lệnh bên trong"
  },
  {
    "type": "retocar_if_else",
    "message0": "nếu %1 thì %2 nếu không %3",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      },
      {
        "type": "input_statement",
        "name": "DO"
      },
      {
        "type": "input_statement",
        "name": "ELSE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Nếu đúng thì làm vế trên, sai thì làm vế dưới"
  },
  {
    "type": "retocar_repeat_until",
    "message0": "lặp lại cho đến khi %1 %2",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Lặp lại lệnh cho đến khi điều kiện thành đúng"
  },
  {
    "type": "retocar_forever",
    "message0": "mãi mãi %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Lặp lại mãi mãi các lệnh bên trong"
  },
  {
    "type": "retocar_while",
    "message0": "trong khi %1 lặp lại",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Lặp lại trong khi điều kiện đúng"
  },
  {
    "type": "retocar_for",
    "message0": "đếm với %1 từ %2 đến %3 mỗi bước %4 lặp lại",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "i"
      },
      {
        "type": "field_number",
        "name": "FROM",
        "value": 0
      },
      {
        "type": "field_number",
        "name": "TO",
        "value": 4
      },
      {
        "type": "field_number",
        "name": "BY",
        "value": 1
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Vòng lặp đếm"
  },
  {
    "type": "retocar_break",
    "message0": "Thoát khỏi vòng lặp hoàn toàn",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Thoát khỏi vòng lặp hiện tại"
  },
  {
    "type": "retocar_continue",
    "message0": "Bắt đầu lần lặp tiếp theo",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Bỏ qua các lệnh dưới và bắt đầu vòng lặp mới"
  },
  {
    "type": "retocar_wait_until",
    "message0": "đợi cho đến khi %1",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFAB19",
    "tooltip": "Tạm dừng chương trình cho đến khi điều kiện đúng"
  },
  {
    "type": "retocar_math_unary",
    "message0": "%1 của %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "OP",
        "options": [
          ["trị tuyệt đối", "ABS"],
          ["làm tròn lên", "CEIL"],
          ["làm tròn xuống", "FLOOR"],
          ["căn bậc hai (√)", "SQRT"],
          ["sin", "SIN"],
          ["cos", "COS"],
          ["tan", "TAN"],
          ["asin", "ASIN"],
          ["acos", "ACOS"],
          ["atan", "ATAN"]
        ]
      },
      {
        "type": "input_value",
        "name": "NUM",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#59C059",
    "tooltip": "Thực hiện phép tính toán trên một số."
  },
  {
    "type": "retocar_random_to",
    "message0": "ngẫu nhiên từ %1 đến %2",
    "args0": [
      {
        "type": "input_value",
        "name": "FROM",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "TO",
        "check": "Number"
      }
    ],
    "inputsInline": true,
    "output": "Number",
    "colour": "#59C059",
    "tooltip": "Lấy số ngẫu nhiên từ giá trị này đến giá trị kia."
  },
  {
    "type": "variables_get",
    "message0": "%1",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "VAR",
        "text": "x"
      }
    ],
    "output": null,
    "colour": "#FF8C00",
    "tooltip": "Lấy giá trị của biến"
  }
]);

function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return { r: 255, g: 0, b: 0 };
  // Hỗ trợ mã màu 6 ký tự (#RRGGBB) và 8 ký tự (#RRGGBBAA)
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 0, b: 0 };
}

// 2. ĐỊNH NGHĨA BỘ DỊCH KHỐI THÀNH CODE C++ (Code Generator)

// Ngăn Blockly tự động nối code của các khối dính dưới khối Sự Kiện ra ngoài global scope
const originalScrub = Blockly.JavaScript.scrub_;
Blockly.JavaScript.scrub_ = function (block, code, opt_thisOnly) {
  if (block.type === 'retocar_event_button') {
    return code; // Không nối nextBlock vào global
  }
  return originalScrub.call(this, block, code, opt_thisOnly);
};

// Dịch khối Khởi động
Blockly.JavaScript.forBlock['esp32_start'] = function (block) {
  Blockly.JavaScript.definitions_['0_forward_decls'] = `#include <Arduino.h>

void setMotorSpeed(int motor, int speed);
void setHeadlight(int side, int state);
void setRGB(int r, int g, int b);
void playBuzzer(int freq, float time);
long readUltrasonic();
float getTimer();
void resetTimer();
`;

  var statements_do = Blockly.JavaScript.statementToCode(block, 'DO');

  // Quét tìm tất cả các khối sự kiện (Event)
  let eventTasks = "";
  const topBlocks = workspace.getTopBlocks(false);
  topBlocks.forEach((b, index) => {
    if (b.type === 'retocar_event_button') {
      const pin = b.getFieldValue('BUTTON');
      const state = b.getFieldValue('STATE');

      let stmts = "";
      const nextBlock = b.getNextBlock();
      if (nextBlock) {
        stmts = Blockly.JavaScript.blockToCode(nextBlock);
      }

      eventTasks += `
  xTaskCreate([](void* arg){
    while(1) {
      if (digitalRead(${pin}) == ${state}) {
${stmts}
        while(digitalRead(${pin}) == ${state}) delay(10);
      }
      delay(10);
    }
  }, "btnTask${index}", 4096, NULL, 1, NULL);
`;
    }
  });

  var code = `unsigned long _timer_offset = 0;

float motor_left_factor = 1.0; // Hệ số bù bánh trái (Motor 2)
float motor_right_factor = 1.0; // Hệ số bù bánh phải (Motor 1)
float motor_curve_ratio = 0.0; // Tỉ lệ tốc độ bánh trong khi rẽ 0s 

#if defined(ESP_ARDUINO_VERSION_MAJOR) && ESP_ARDUINO_VERSION_MAJOR >= 3
  // Tương thích với ESP32 Arduino Core v3.0+
  void initPWM(int pin) {
    if (pin == 32 || pin == 33) {
      pinMode(pin, OUTPUT);
    }
    ledcAttach(pin, 1000, 8);
  }
  void writePWM(int pin, int value) {
    ledcWrite(pin, value);
  }
#else
  // Tương thích với ESP32 Arduino Core v2.x - Dùng các kênh cao (10, 11, 12, 13) để không đụng hàng với analogWrite của RGB/Còi
  int getLEDCChannel(int pin) {
    if (pin == 25) return 10;
    if (pin == 26) return 11;
    if (pin == 32) return 12;
    if (pin == 33) return 13;
    return 0;
  }
  void initPWM(int pin) {
    if (pin == 32 || pin == 33) {
      pinMode(pin, OUTPUT);
    }
    int chan = getLEDCChannel(pin);
    ledcSetup(chan, 1000, 8); // Tần số 1000Hz để khớp với analogWrite nguyên bản giúp hai bên quay đều
    ledcAttachPin(pin, chan);
  }
  void writePWM(int pin, int value) {
    ledcWrite(getLEDCChannel(pin), value);
  }
#endif

float getTimer() {
  return (millis() - _timer_offset) / 1000.0;
}

void resetTimer() {
  _timer_offset = millis();
}

void setMotorSpeed(int motor, int speed) {
  // Motor 1 (chân 25, 26) là bánh Phải. Motor 2 (chân 32, 33) là bánh Trái.
  if (motor == 1) speed = speed * motor_right_factor;
  if (motor == 2) speed = speed * motor_left_factor;

  // Bù ma sát tĩnh: Đảm bảo bánh xe không bị đứng im khi rẽ tốc độ thấp dưới sàn nhà
  if (speed > 0 && speed < 50) speed = 50;
  if (speed < 0 && speed > -50) speed = -50;

  // Giới hạn giá trị trong khoảng -255 đến 255 để tránh tràn số PWM
  if (speed > 255) speed = 255;
  if (speed < -255) speed = -255;

  if (speed >= 0) {
    if (motor == 1) { 
      // Chế độ hãm chậm (Slow Decay) cho bánh Phải khi chạy tới: chân 25 băm xung đảo, chân 26 ở mức HIGH (255)
      writePWM(25, 255 - speed); writePWM(26, 255);
    } else if (motor == 2) { 
      // Chế độ hãm chậm (Slow Decay) cho bánh Trái khi chạy tới: chân 32 băm xung đảo, chân 33 ở mức HIGH (255)
      writePWM(32, 255 - speed); writePWM(33, 255);
    }
  } else {
    speed = -speed;
    if (motor == 1) { 
      // Chế độ hãm chậm (Slow Decay) cho bánh Phải khi đi lùi: chân 25 ở mức HIGH (255), chân 26 băm xung đảo
      writePWM(25, 255); writePWM(26, 255 - speed);
    } else if (motor == 2) { 
      // Chế độ hãm chậm (Slow Decay) cho bánh Trái khi đi lùi: chân 32 ở mức HIGH (255), chân 33 băm xung đảo
      writePWM(32, 255); writePWM(33, 255 - speed);
    }
  }
}

void setHeadlight(int side, int state) {
  if (side == 0 || side == 1) {
    // Trái là chân 4 (active-LOW)
    digitalWrite(4, state ? LOW : HIGH);
  }
  if (side == 0 || side == 2) {
    // Phải là chân 2 (active-LOW)
    digitalWrite(2, state ? LOW : HIGH);
  }
}

void setRGB(int r, int g, int b) {
  // LED RGB trên mạch là Dương Chung (Common Anode), LOW=Sáng, HIGH=Tắt
  // Đặc biệt: Chân Đỏ (R) và Xanh Dương (B) bị hàn ngược! (R=13, B=27)
  analogWrite(13, 255 - r);
  analogWrite(14, 255 - g);
  analogWrite(27, 255 - b);
}

void playBuzzer(int freq, float time) {
  if (freq > 0) {
    tone(15, freq, time * 1000);
    delay(time * 1000);
  } else {
    noTone(15);
    delay(time * 1000);
  }
}

long readUltrasonic() {
  delay(10); // Đảm bảo mắt siêu âm kịp hồi đáp giữa các lần đọc liên tiếp trong hàm
  digitalWrite(18, LOW);
  delayMicroseconds(2);
  digitalWrite(18, HIGH);
  delayMicroseconds(10);
  digitalWrite(18, LOW);
  long duration = pulseIn(5, HIGH, 30000);
  if (duration == 0) return 999;
  return duration * 0.034 / 2;
}

void sensorTelemetryTask(void* arg) {
  while (true) {
    int lightValue = analogRead(36);
    long ultrasonicValue = readUltrasonic();
    int line1 = digitalRead(23);
    int line2 = digitalRead(16);
    int line3 = digitalRead(17);
    int button1 = digitalRead(34);
    int button2 = digitalRead(35);
    Serial.printf(
      "@RETOBLOCK_SENSOR:{\\\"light\\\":%d,\\\"ultrasonic\\\":%ld,\\\"line1\\\":%d,\\\"line2\\\":%d,\\\"line3\\\":%d,\\\"button1\\\":%d,\\\"button2\\\":%d}\\n",
      lightValue, ultrasonicValue, line1, line2, line3, button1, button2
    );
    vTaskDelay(pdMS_TO_TICKS(500));
  }
}

void setup() {
  Serial.begin(115200);
  
  // Khởi tạo các chân cảm biến
  pinMode(18, OUTPUT); // Siêu âm TRIG
  pinMode(5, INPUT);   // Siêu âm ECHO
  pinMode(23, INPUT);  // Line S1
  pinMode(16, INPUT);  // Line S2
  pinMode(17, INPUT);  // Line S3
  pinMode(36, INPUT);  // Ánh sáng
  pinMode(34, INPUT);  // Nút nhấn 1
  pinMode(35, INPUT);  // Nút nhấn 2
  
  // Khởi tạo PWM phần cứng (LEDC) cho cả 4 chân điều khiển động cơ
  initPWM(25);
  initPWM(26);
  initPWM(32);
  initPWM(33);
  
  pinMode(27, OUTPUT); digitalWrite(27, HIGH); // Tắt RGB (active-LOW)
  pinMode(14, OUTPUT); digitalWrite(14, HIGH); // Tắt RGB
  pinMode(13, OUTPUT); digitalWrite(13, HIGH); // Tắt RGB
  pinMode(4, OUTPUT); digitalWrite(4, HIGH); // Tắt đèn Trái (active-LOW)
  pinMode(2, OUTPUT); digitalWrite(2, HIGH); // Tắt đèn Phải (active-LOW)
  pinMode(15, OUTPUT);

  // Gửi dữ liệu cảm biến cho bảng theo dõi trên Retoblock Web.
  xTaskCreate(sensorTelemetryTask, "sensorTelemetry", 3072, NULL, 1, NULL);

${eventTasks}
${statements_do}
}

void loop() {
}
`;
  return code;
};

// Dịch khối GPIO
Blockly.JavaScript.forBlock['esp32_digital_write'] = function (block) {
  const dropdown_pin = block.getFieldValue('PIN');
  const dropdown_state = block.getFieldValue('STATE');

  // Sinh ra đoạn code C++ chuẩn cho cấu trúc Arduino ESP32
  // Kèm theo cấu hình pinMode tự động
  const code = `  pinMode(${dropdown_pin}, OUTPUT);\n  digitalWrite(${dropdown_pin}, ${dropdown_state});\n`;
  return code;
};

// --- Dịch khối Hành động (Di chuyển) ---
function calculatePWM(speed) {
  return `(${speed} * 255 / 100)`;
}

Blockly.JavaScript.forBlock['retocar_move_car'] = function (block) {
  const dir = block.getFieldValue('DIR');
  const speed = block.getFieldValue('SPEED');
  const pwm = calculatePWM(speed);
  if (dir === 'FORWARD') {
    return `  setMotorSpeed(1, ${pwm});\n  setMotorSpeed(2, ${pwm});\n`;
  } else if (dir === 'BACKWARD') {
    return `  setMotorSpeed(1, -${pwm});\n  setMotorSpeed(2, -${pwm});\n`;
  } else if (dir === 'LEFT') {
    return `  setMotorSpeed(1, ${pwm});\n  setMotorSpeed(2, -${pwm});\n`;
  } else if (dir === 'RIGHT') {
    return `  setMotorSpeed(1, -${pwm});\n  setMotorSpeed(2, ${pwm});\n`;
  }
  return "";
};

Blockly.JavaScript.forBlock['retocar_move_individual_wheel'] = function (block) {
  const wheel = block.getFieldValue('WHEEL');
  const dir = block.getFieldValue('DIR');
  const speed = block.getFieldValue('SPEED');
  const pwm = calculatePWM(speed);
  const sign = (dir === 'FORWARD') ? '' : '-';
  const motor = (wheel === 'RIGHT') ? 1 : 2;
  return `  setMotorSpeed(${motor}, ${sign}${pwm});\n`;
};

Blockly.JavaScript.forBlock['retocar_stop'] = function (block) {
  return `  setMotorSpeed(1, 0);\n  setMotorSpeed(2, 0);\n`;
};

Blockly.JavaScript.forBlock['retocar_wait'] = function (block) {
  const time = block.getFieldValue('TIME');
  return `  delay(${time} * 1000);\n`;
};

Blockly.JavaScript.forBlock['retocar_set_rgb'] = function (block) {
  const colorHex = block.getFieldValue('COLOR') || '#ff0000';
  const rgb = hexToRgb(colorHex);
  return `  setRGB(${rgb.r}, ${rgb.g}, ${rgb.b});\n`;
};

Blockly.JavaScript.forBlock['retocar_led_control'] = function (block) {
  const side = block.getFieldValue('SIDE');
  const state = block.getFieldValue('STATE');
  return `  setHeadlight(${side}, ${state});\n`;
};

Blockly.JavaScript.forBlock['retocar_buzzer_control'] = function (block) {
  const freq = block.getFieldValue('FREQ');
  return `  tone(15, ${freq});\n`;
};

Blockly.JavaScript.forBlock['retocar_buzzer_stop'] = function (block) {
  return `  noTone(15);\n`;
};

Blockly.JavaScript.forBlock['retocar_sensor_light'] = function (block) {
  return ['analogRead(36)', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['retocar_sensor_ultrasonic'] = function (block) {
  return ['readUltrasonic()', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['retocar_sensor_line'] = function (block) {
  const val = block.getFieldValue('VAL');
  const pin = block.getFieldValue('PORT');
  return [`(digitalRead(${pin}) == ${val})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['retocar_sensor_button'] = function (block) {
  const pin = block.getFieldValue('BUTTON');
  const state = block.getFieldValue('STATE');
  return [`(digitalRead(${pin}) == ${state})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['retocar_event_button'] = function (block) {
  // Code thực sự đã được inject vào setup() bởi khối esp32_start
  return "";
};

Blockly.JavaScript.forBlock['retocar_timer_get'] = function (block) {
  return ['getTimer()', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['retocar_timer_reset'] = function (block) {
  return '  resetTimer();\n';
};

Blockly.JavaScript.forBlock['retocar_if'] = function (block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
  const statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
  return `  if (${condition}) {\n${statements_do}  }\n`;
};

Blockly.JavaScript.forBlock['retocar_if_else'] = function (block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
  const statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
  const statements_else = Blockly.JavaScript.statementToCode(block, 'ELSE');
  return `  if (${condition}) {\n${statements_do}  } else {\n${statements_else}  }\n`;
};

Blockly.JavaScript.forBlock['retocar_repeat_until'] = function (block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
  const statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
  return `  while (!(${condition})) {\n${statements_do}    delay(10);\n  }\n`;
};

Blockly.JavaScript.forBlock['retocar_forever'] = function (block) {
  const statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
  return `  while (true) {\n    static unsigned long last_print = 0;\n    if (millis() - last_print > 200) {\n      last_print = millis();\n      Serial.print("Trai(S1):"); Serial.print(digitalRead(23));\n      Serial.print(" | Giua(S2):"); Serial.print(digitalRead(16));\n      Serial.print(" | Phai(S3):"); Serial.println(digitalRead(17));\n    }\n${statements_do}    delay(10);\n  }\n`;
};

Blockly.JavaScript.forBlock['retocar_while'] = function (block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
  const statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
  return `  while (${condition}) {\n${statements_do}    delay(10);\n  }\n`;
};

Blockly.JavaScript.forBlock['retocar_for'] = function (block) {
  const varName = block.getField('VAR').getText();
  const from = block.getFieldValue('FROM');
  const to = block.getFieldValue('TO');
  const by = block.getFieldValue('BY');
  const statements_do = Blockly.JavaScript.statementToCode(block, 'DO');

  let condition;
  if (parseFloat(by) >= 0) {
    condition = `${varName} <= ${to}`;
  } else {
    condition = `${varName} >= ${to}`;
  }

  return `  for (float ${varName} = ${from}; ${condition}; ${varName} += ${by}) {\n${statements_do}    delay(10);\n  }\n`;
};

Blockly.JavaScript.forBlock['retocar_break'] = function (block) {
  return "  break;\n";
};

Blockly.JavaScript.forBlock['retocar_continue'] = function (block) {
  return "  continue;\n";
};

Blockly.JavaScript.forBlock['retocar_wait_until'] = function (block) {
  const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
  return `  while (!(${condition})) {\n    delay(10);\n  }\n`;
};


Blockly.JavaScript.forBlock['math_arithmetic'] = function(block) {
  const operator = block.getFieldValue('OP');
  const order = Blockly.JavaScript.ORDER_NONE;
  const argument0 = Blockly.JavaScript.valueToCode(block, 'A', order) || '0';
  const argument1 = Blockly.JavaScript.valueToCode(block, 'B', order) || '0';
  let code;
  if (operator === 'ADD') {
    code = `${argument0} + ${argument1}`;
  } else if (operator === 'MINUS') {
    code = `${argument0} - ${argument1}`;
  } else if (operator === 'MULTIPLY') {
    code = `${argument0} * ${argument1}`;
  } else if (operator === 'DIVIDE') {
    code = `((float)${argument0} / ${argument1})`;
  } else if (operator === 'POWER') {
    code = `pow(${argument0}, ${argument1})`;
  }
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['logic_compare'] = function(block) {
  const operator = block.getFieldValue('OP');
  const argument0 = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_NONE) || '0';
  const argument1 = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_NONE) || '0';
  let op;
  if (operator === 'EQ') op = '==';
  else if (operator === 'NEQ') op = '!=';
  else if (operator === 'LT') op = '<';
  else if (operator === 'LTE') op = '<=';
  else if (operator === 'GT') op = '>';
  else if (operator === 'GTE') op = '>=';
  return [`(${argument0} ${op} ${argument1})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['logic_operation'] = function(block) {
  const operator = block.getFieldValue('OP');
  const argument0 = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_NONE) || 'false';
  const argument1 = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_NONE) || 'false';
  const op = (operator === 'AND') ? '&&' : '||';
  return [`(${argument0} ${op} ${argument1})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['logic_negate'] = function(block) {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE) || 'false';
  return [`!(${argument0})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['math_random_int'] = function(block) {
  const argument0 = Blockly.JavaScript.valueToCode(block, 'FROM', Blockly.JavaScript.ORDER_NONE) || '0';
  const argument1 = Blockly.JavaScript.valueToCode(block, 'TO', Blockly.JavaScript.ORDER_NONE) || '0';
  return [`random(${argument0}, ${argument1} + 1)`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['math_single'] = function(block) {
  const operator = block.getFieldValue('OP');
  const argument0 = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_NONE) || '0';
  let code;
  if (operator === 'ROOT') code = `sqrt(${argument0})`;
  else if (operator === 'ABS') code = `abs(${argument0})`;
  else if (operator === 'NEG') code = `-(${argument0})`;
  else if (operator === 'LN') code = `log(${argument0})`;
  else if (operator === 'LOG10') code = `log10(${argument0})`;
  else if (operator === 'EXP') code = `exp(${argument0})`;
  else if (operator === 'POW10') code = `pow(10, ${argument0})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['math_trig'] = function(block) {
  const operator = block.getFieldValue('OP');
  const argument0 = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_NONE) || '0';
  let code;
  if (operator === 'SIN') code = `sin(${argument0} * PI / 180.0)`;
  else if (operator === 'COS') code = `cos(${argument0} * PI / 180.0)`;
  else if (operator === 'TAN') code = `tan(${argument0} * PI / 180.0)`;
  else if (operator === 'ASIN') code = `asin(${argument0}) * 180.0 / PI`;
  else if (operator === 'ACOS') code = `acos(${argument0}) * 180.0 / PI`;
  else if (operator === 'ATAN') code = `atan(${argument0}) * 180.0 / PI`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['math_round'] = function(block) {
  const operator = block.getFieldValue('OP');
  const argument0 = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_NONE) || '0';
  let code;
  if (operator === 'ROUND') code = `round(${argument0})`;
  else if (operator === 'ROUNDUP') code = `ceil(${argument0})`;
  else if (operator === 'ROUNDDOWN') code = `floor(${argument0})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

function sanitizeFunctionName(str) {
  if (!str) return 'my_custom_block';
  let clean = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  clean = clean.replace(/đ/g, 'd').replace(/Đ/g, 'D');
  clean = clean.replace(/[^a-zA-Z0-9_]/g, '_');
  clean = clean.replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  if (/^[0-9]/.test(clean)) {
    clean = 'func_' + clean;
  }
  return clean || 'my_custom_block';
}

Blockly.JavaScript.forBlock['procedures_defnoreturn'] = function(block) {
  const rawName = block.getFieldValue('NAME') || 'custom_block';
  const funcName = sanitizeFunctionName(rawName);
  let branch = Blockly.JavaScript.statementToCode(block, 'STACK');
  const args = [];
  const variables = (typeof block.getVars === 'function') ? block.getVars() : (block.arguments_ || []);
  for (let i = 0; i < variables.length; i++) {
    const rawArgName = typeof variables[i] === 'string' ? variables[i] : (variables[i].name || ('arg' + i));
    args[i] = sanitizeFunctionName(rawArgName);
  }
  const typedArgs = args.map(arg => `float ${arg}`).join(', ');
  let code = `void ${funcName}(${typedArgs}) {\n${branch}}\n`;
  code = Blockly.JavaScript.scrub_(block, code);
  Blockly.JavaScript.definitions_['%' + funcName] = code;
  return null;
};

Blockly.JavaScript.forBlock['procedures_defreturn'] = function(block) {
  const rawName = block.getFieldValue('NAME') || 'custom_block';
  const funcName = sanitizeFunctionName(rawName);
  let branch = Blockly.JavaScript.statementToCode(block, 'STACK');
  let returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN',
      Blockly.JavaScript.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = `  return (${returnValue});\n`;
  }
  const args = [];
  const variables = (typeof block.getVars === 'function') ? block.getVars() : (block.arguments_ || []);
  for (let i = 0; i < variables.length; i++) {
    const rawArgName = typeof variables[i] === 'string' ? variables[i] : (variables[i].name || ('arg' + i));
    args[i] = sanitizeFunctionName(rawArgName);
  }
  const typedArgs = args.map(arg => `float ${arg}`).join(', ');
  let code = `float ${funcName}(${typedArgs}) {\n${branch}${returnValue}}\n`;
  code = Blockly.JavaScript.scrub_(block, code);
  Blockly.JavaScript.definitions_['%' + funcName] = code;
  return null;
};

Blockly.JavaScript.forBlock['procedures_callnoreturn'] = function(block) {
  const rawName = block.getFieldValue('NAME') || 'custom_block';
  const funcName = sanitizeFunctionName(rawName);
  const args = [];
  const variables = block.arguments_ || [];
  for (let i = 0; i < variables.length; i++) {
    args[i] = Blockly.JavaScript.valueToCode(block, 'ARG' + i,
        Blockly.JavaScript.ORDER_NONE) || '0';
  }
  return `  ${funcName}(${args.join(', ')});\n`;
};

Blockly.JavaScript.forBlock['procedures_callreturn'] = function(block) {
  const rawName = block.getFieldValue('NAME') || 'custom_block';
  const funcName = sanitizeFunctionName(rawName);
  const args = [];
  const variables = block.arguments_ || [];
  for (let i = 0; i < variables.length; i++) {
    args[i] = Blockly.JavaScript.valueToCode(block, 'ARG' + i,
        Blockly.JavaScript.ORDER_NONE) || '0';
  }
  return [`${funcName}(${args.join(', ')})`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['retocar_math_unary'] = function(block) {
  const operator = block.getFieldValue('OP');
  const argument0 = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_NONE) || '0';
  let code;
  if (operator === 'ABS') code = `abs(${argument0})`;
  else if (operator === 'CEIL') code = `ceil(${argument0})`;
  else if (operator === 'FLOOR') code = `floor(${argument0})`;
  else if (operator === 'SQRT') code = `sqrt(${argument0})`;
  else if (operator === 'SIN') code = `sin(${argument0} * PI / 180.0)`;
  else if (operator === 'COS') code = `cos(${argument0} * PI / 180.0)`;
  else if (operator === 'TAN') code = `tan(${argument0} * PI / 180.0)`;
  else if (operator === 'ASIN') code = `asin(${argument0}) * 180.0 / PI`;
  else if (operator === 'ACOS') code = `acos(${argument0}) * 180.0 / PI`;
  else if (operator === 'ATAN') code = `atan(${argument0}) * 180.0 / PI`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['retocar_random_to'] = function(block) {
  const from = Blockly.JavaScript.valueToCode(block, 'FROM', Blockly.JavaScript.ORDER_NONE) || '1';
  const to = Blockly.JavaScript.valueToCode(block, 'TO', Blockly.JavaScript.ORDER_NONE) || '100';
  return [`random(${from}, ${to} + 1)`, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['variables_get'] = function (block) {
  const variableId = block.getFieldValue('VAR');
  const varName = variableId
    ? Blockly.JavaScript.getVariableName(variableId)
    : 'x';
  return [varName, Blockly.JavaScript.ORDER_ATOMIC];
};

// Ghi đè các khối chuẩn của Blockly để sinh ra code C++ thay vì JS
Blockly.JavaScript.forBlock['text_print'] = function (block) {
  const msg = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_NONE) || '""';
  return `  Serial.println(${msg});\n`;
};

Blockly.JavaScript.forBlock['text'] = function (block) {
  const text = block.getFieldValue('TEXT').replace(/"/g, '\\"');
  return [`"${text}"`, Blockly.JavaScript.ORDER_ATOMIC];
};

// Override một số text chuẩn của Blockly theo yêu cầu
if (Blockly.Msg) {
  Blockly.Msg.VARIABLES_SET = "thiết lập %1 đến %2";
  Blockly.Msg.LOGIC_OPERATION_AND = "và";
  Blockly.Msg.LOGIC_OPERATION_OR = "hoặc";
  Blockly.Msg.MATH_RANDOM_INT_TITLE_RANDOM = "ngẫu nhiên từ %1 đến %2";
  
  // Bỏ chữ "thủ tục để", chỉ giữ lại tên khối
  Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = "";
  Blockly.Msg.PROCEDURES_DEFRETURN_TITLE = "";
  Blockly.Msg.PROCEDURES_DEFNORETURN_DO = "";
  Blockly.Msg.PROCEDURES_DEFRETURN_DO = "";
  Blockly.Msg.PROCEDURES_DEFRETURN_RETURN = "hoàn trả";
  Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE = "các tham số";
  Blockly.Msg.PROCEDURES_MUTATORARG_TITLE = "biến:";
}

// Thay đổi màu sắc của các khối thủ tục giống Scratch/mBlock (màu tím #9966ff)
const procBlocks = [
  'procedures_defnoreturn',
  'procedures_defreturn',
  'procedures_mutatorcontainer',
  'procedures_mutatorarg',
  'procedures_callnoreturn',
  'procedures_callreturn'
];
procBlocks.forEach(name => {
  const blockDef = Blockly.Blocks[name];
  if (blockDef && blockDef.init) {
    const originalInit = blockDef.init;
    blockDef.init = function() {
      originalInit.call(this);
      this.setColour("#9966ff");
      if (typeof this.setMutator === 'function') {
        this.setMutator(null);
      }
    };
  }
});

// Ghi đè cấu trúc khối math_change (thay đổi biến)
Blockly.Blocks['math_change'] = {
  init: function () {
    this.jsonInit({
      "message0": "%1 %2 %3 đơn vị",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "MODE",
          "options": [
            ["tăng", "1"],
            ["giảm", "-1"]
          ]
        },
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": "item"
        },
        {
          "type": "input_value",
          "name": "DELTA",
          "check": "Number"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": "#FF8C1A",
      "tooltip": "Tăng hoặc giảm biến một lượng"
    });
  }
};

// Sinh C++ cho khối tăng/giảm biến. Generator mặc định của Blockly tạo
// biểu thức JavaScript có `typeof`, khiến PlatformIO không biên dịch được.
Blockly.JavaScript.forBlock['esp32_servo'] = function(block) {
  const angle = block.getFieldValue('ANGLE');
  return '  writeServoAngle(' + angle + ');\n';
};

Blockly.JavaScript.forBlock['esp32_read_color'] = function(block) {
  return ['colorSensor.getColorName()', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.forBlock['math_change'] = function (block) {
  const variableId = block.getFieldValue('VAR');
  const varName = variableId
    ? Blockly.JavaScript.getVariableName(variableId)
    : 'item';
  const delta = Blockly.JavaScript.valueToCode(
    block,
    'DELTA',
    Blockly.JavaScript.ORDER_NONE
  ) || '0';
  const operator = block.getFieldValue('MODE') === '-1' ? '-=' : '+=';
  return `  ${varName} ${operator} ${delta};\n`;
};

// Ghi đè cấu trúc menu Biến số để thêm khối điền số mặc định (shadow block)
Blockly.Variables.flyoutCategory = function (workspace) {
  var xmlList = [];

  var button = Blockly.utils.xml.createElement('button');
  button.setAttribute('text', Blockly.Msg.NEW_VARIABLE);
  button.setAttribute('callbackKey', 'CREATE_VARIABLE');
  workspace.registerButtonCallback('CREATE_VARIABLE', function (btn) {
    Blockly.Variables.createVariableButtonHandler(btn.getTargetWorkspace());
  });
  xmlList.push(button);

  var variableModelList = workspace.getVariableMap().getVariablesOfType('');
  if (variableModelList.length > 0) {
    var mostRecentVariable = variableModelList[variableModelList.length - 1];

    // variables_set
    var blockSet = Blockly.utils.xml.createElement('block');
    blockSet.setAttribute('type', 'variables_set');
    blockSet.setAttribute('gap', '8');
    blockSet.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));

    var valueSet = Blockly.utils.xml.createElement('value');
    valueSet.setAttribute('name', 'VALUE');
    var shadowSet = Blockly.utils.xml.createElement('shadow');
    shadowSet.setAttribute('type', 'math_number');
    var fieldSet = Blockly.utils.xml.createElement('field');
    fieldSet.setAttribute('name', 'NUM');
    fieldSet.appendChild(Blockly.utils.xml.createTextNode('0'));
    shadowSet.appendChild(fieldSet);
    valueSet.appendChild(shadowSet);
    blockSet.appendChild(valueSet);
    xmlList.push(blockSet);

    // math_change
    var blockChange = Blockly.utils.xml.createElement('block');
    blockChange.setAttribute('type', 'math_change');
    blockChange.setAttribute('gap', '8');
    blockChange.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));

    var valueChange = Blockly.utils.xml.createElement('value');
    valueChange.setAttribute('name', 'DELTA');
    var shadowChange = Blockly.utils.xml.createElement('shadow');
    shadowChange.setAttribute('type', 'math_number');
    var fieldChange = Blockly.utils.xml.createElement('field');
    fieldChange.setAttribute('name', 'NUM');
    fieldChange.appendChild(Blockly.utils.xml.createTextNode('1'));
    shadowChange.appendChild(fieldChange);
    valueChange.appendChild(shadowChange);
    blockChange.appendChild(valueChange);
    xmlList.push(blockChange);

    // variables_get
    var blockGet = Blockly.utils.xml.createElement('block');
    blockGet.setAttribute('type', 'variables_get');
    blockGet.setAttribute('gap', '24');
    blockGet.appendChild(Blockly.Variables.generateVariableFieldDom(mostRecentVariable));
    xmlList.push(blockGet);
  }
  return xmlList;
};

function customProceduresFlyoutCategory(workspace) {
  const xmlList = [];
  
  const button = Blockly.utils.xml.createElement('button');
  button.setAttribute('text', 'Tạo một khối');
  button.setAttribute('callbackKey', 'CREATE_CUSTOM_BLOCK');
  workspace.registerButtonCallback('CREATE_CUSTOM_BLOCK', function() {
    openCustomBlockModal(workspace);
  });
  xmlList.push(button);
  
  const defBlocks = workspace.getBlocksByType('procedures_defnoreturn', false)
    .concat(workspace.getBlocksByType('procedures_defreturn', false));
    
  defBlocks.forEach(defBlock => {
    const funcName = defBlock.getFieldValue('NAME');
    if (!funcName) return;
    
    const hasReturn = (defBlock.type === 'procedures_defreturn');
    const args = defBlock.arguments_ || [];
    
    const blockEl = Blockly.utils.xml.createElement('block');
    blockEl.setAttribute('type', hasReturn ? 'procedures_callreturn' : 'procedures_callnoreturn');
    blockEl.setAttribute('gap', '16');
    
    const mutationEl = Blockly.utils.xml.createElement('mutation');
    mutationEl.setAttribute('name', funcName);
    
    args.forEach(arg => {
      const argEl = Blockly.utils.xml.createElement('arg');
      argEl.setAttribute('name', arg);
      mutationEl.appendChild(argEl);
    });
    
    blockEl.appendChild(mutationEl);
    xmlList.push(blockEl);
  });
  
  return xmlList;
}

function customVariablesFlyoutCategory(workspace) {
  const xmlList = [];
  
  const button = Blockly.utils.xml.createElement('button');
  button.setAttribute('text', 'Tạo một biến...');
  button.setAttribute('callbackkey', 'CREATE_VARIABLE');
  xmlList.push(button);

  if (!workspace || typeof workspace.getVariableMap !== 'function') {
    return xmlList;
  }

  const variableList = workspace.getVariableMap().getVariablesOfType('');
  if (variableList && variableList.length > 0) {
    // Tạo riêng từng khối giá trị biến cho mỗi biến được tạo (y hệt Scratch / mBlock)
    variableList.forEach(variable => {
      const block = Blockly.utils.xml.createElement('block');
      block.setAttribute('type', 'variables_get');
      block.setAttribute('gap', '8');
      const field = Blockly.utils.xml.createElement('field');
      field.setAttribute('name', 'VAR');
      field.setAttribute('variabletype', variable.type || '');
      field.id = variable.getId();
      field.appendChild(Blockly.utils.xml.createTextNode(variable.name));
      block.appendChild(field);
      xmlList.push(block);
    });

    // Khối đặt biến
    const setBlock = Blockly.utils.xml.createElement('block');
    setBlock.setAttribute('type', 'variables_set');
    setBlock.setAttribute('gap', '8');
    const setField = Blockly.utils.xml.createElement('field');
    setField.setAttribute('name', 'VAR');
    setField.id = variableList[0].getId();
    setField.appendChild(Blockly.utils.xml.createTextNode(variableList[0].name));
    setBlock.appendChild(setField);
    const setValue = Blockly.utils.xml.createElement('value');
    setValue.setAttribute('name', 'VALUE');
    const shadow = Blockly.utils.xml.createElement('shadow');
    shadow.setAttribute('type', 'math_number');
    const numField = Blockly.utils.xml.createElement('field');
    numField.setAttribute('name', 'NUM');
    numField.appendChild(Blockly.utils.xml.createTextNode('0'));
    shadow.appendChild(numField);
    setValue.appendChild(shadow);
    setBlock.appendChild(setValue);
    xmlList.push(setBlock);

    // Khối thay đổi biến
    const changeBlock = Blockly.utils.xml.createElement('block');
    changeBlock.setAttribute('type', 'math_change');
    changeBlock.setAttribute('gap', '8');
    const changeField = Blockly.utils.xml.createElement('field');
    changeField.setAttribute('name', 'VAR');
    changeField.id = variableList[0].getId();
    changeField.appendChild(Blockly.utils.xml.createTextNode(variableList[0].name));
    changeBlock.appendChild(changeField);
    const changeValue = Blockly.utils.xml.createElement('value');
    changeValue.setAttribute('name', 'DELTA');
    const changeShadow = Blockly.utils.xml.createElement('shadow');
    changeShadow.setAttribute('type', 'math_number');
    const changeNumField = Blockly.utils.xml.createElement('field');
    changeNumField.setAttribute('name', 'NUM');
    changeNumField.appendChild(Blockly.utils.xml.createTextNode('1'));
    changeShadow.appendChild(changeNumField);
    changeValue.appendChild(changeShadow);
    changeBlock.appendChild(changeValue);
    xmlList.push(changeBlock);
  }

  return xmlList;
}

// Khởi tạo vùng làm việc kéo thả (Biến Blockly lúc này đã có sẵn từ file HTML)
const workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox'),
  renderer: 'zelos',
  media: './node_modules/blockly/media/',
  scrollbars: true,
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.7,
    maxScale: 1.5,
    minScale: 0.3,
    scaleSpeed: 1.08,
    pinch: true
  },
  trashcan: false,
  grid: {
    spacing: 20,
    length: 3,
    colour: '#ccc',
    snap: true
  }
});

workspace.registerButtonCallback('CREATE_VARIABLE', (btn) => {
  Blockly.Variables.createVariableButtonHandler(btn.getTargetWorkspace());
});
workspace.registerToolboxCategoryCallback('VARIABLE', customVariablesFlyoutCategory);
workspace.registerToolboxCategoryCallback('PROCEDURE', customProceduresFlyoutCategory);

function parseWorkspaceXml(xmlText) {
  const normalizedXml = String(xmlText || '').trim();
  if (!normalizedXml) {
    throw new Error('File dự án không có dữ liệu.');
  }

  const textToDom = Blockly.utils &&
    Blockly.utils.xml &&
    typeof Blockly.utils.xml.textToDom === 'function'
    ? Blockly.utils.xml.textToDom
    : Blockly.Xml.textToDom;

  if (typeof textToDom !== 'function') {
    throw new Error('Phiên bản Blockly hiện tại không hỗ trợ đọc file XML.');
  }

  return textToDom(normalizedXml);
}

function loadWorkspaceXml(xmlText) {
  // Phân tích file trước khi xóa màn hình hiện tại để file hỏng không làm mất dự án đang mở.
  const projectDom = parseWorkspaceXml(xmlText);
  const previousDom = Blockly.Xml.workspaceToDom(workspace);

  try {
    // API này tạm ngưng các sự kiện trong lúc thay toàn bộ workspace, tránh autosave
    // ghi đè file backup bằng trạng thái trống giữa quá trình mở dự án.
    Blockly.Xml.clearWorkspaceAndLoadFromXml(projectDom, workspace);
  } catch (error) {
    Blockly.Xml.clearWorkspaceAndLoadFromXml(previousDom, workspace);
    throw error;
  }

  const blockCount = workspace.getAllBlocks(false).length;
  const sourceHasBlocks = /<(?:block|shadow)\b/i.test(String(xmlText));
  if (sourceHasBlocks && blockCount === 0) {
    Blockly.Xml.clearWorkspaceAndLoadFromXml(previousDom, workspace);
    throw new Error('File có khối lệnh nhưng Blockly không thể nạp các khối đó.');
  }

  // XML lưu cả tọa độ khối. Tự căn lại giúp dự án luôn hiện ra dù được lưu
  // ở kích thước cửa sổ hoặc mức thu phóng khác.
  requestAnimationFrame(() => {
    Blockly.svgResize(workspace);
    if (blockCount > 0) workspace.zoomToFit();
  });

  return blockCount;
}

// Tự động lưu khối lệnh xuống đĩa cứng mỗi khi thay đổi
async function autoSaveWorkspace() {
  try {
    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToText(xml);
    await window.electronAPI.saveWorkspace(xmlText);
  } catch (e) {
    console.error("Lỗi tự động lưu:", e);
  }
}

// Nạp khối lệnh đã lưu từ đĩa cứng (nếu có), nếu không có thì nạp khối mặc định
async function loadSavedWorkspace() {
  try {
    const result = await window.electronAPI.loadWorkspace();
    if (result.success && result.xmlText && result.xmlText.trim() !== '') {
      loadWorkspaceXml(result.xmlText);
    } else {
      createDefaultStartBlock();
    }
  } catch (e) {
    console.error("Lỗi phục hồi khối lệnh:", e);
    createDefaultStartBlock();
  } finally {
    // Chỉ đăng ký lắng nghe thay đổi sau khi quá trình phục hồi đã kết thúc hoàn toàn
    workspace.addChangeListener((event) => {
      // Bỏ qua các sự kiện giao diện (như cuộn, chọn khối) và tự động lưu khi có thay đổi thực tế
      if (event.isUiEvent) return;
      autoSaveWorkspace();
    });
  }
}

function createDefaultStartBlock() {
  const startBlock = workspace.newBlock('esp32_start');
  startBlock.initSvg();
  startBlock.render();
  startBlock.moveBy(50, 50);
}

// 1. Phục hồi khối lệnh từ bộ nhớ đĩa cứng trước (hàm này sẽ tự động đăng ký change listener sau khi chạy xong)
loadSavedWorkspace();

let currentOpenFilePath = null;

// Nhận sự kiện từ menu "Dự án mới"
window.electronAPI.onNewProject(() => {
  if (confirm("Bạn có chắc chắn muốn tạo dự án mới? Mọi khối chưa lưu sẽ mất.")) {
    workspace.clear();
    createDefaultStartBlock();
    currentOpenFilePath = null;
  }
});

// Nhận sự kiện từ menu "Mở dự án"
window.electronAPI.onOpenProject((data) => {
  try {
    if (data.xmlText && data.xmlText.trim() !== "") {
      const blockCount = loadWorkspaceXml(data.xmlText);
      currentOpenFilePath = data.filePath;
      alert(`Đã mở dự án thành công (${blockCount} khối lệnh).`);
    }
  } catch (err) {
    console.error("Lỗi mở dự án:", err);
    alert("Không thể mở file dự án này. Dữ liệu hiện tại vẫn được giữ nguyên.\n\nChi tiết: " + err.message);
  }
});

window.electronAPI.onProjectError((message) => {
  alert(message);
});

// Nhận sự kiện từ menu "Lưu dự án"
window.electronAPI.onSaveProject(async () => {
  const xml = Blockly.Xml.workspaceToDom(workspace);
  const xmlText = Blockly.Xml.domToText(xml);
  const response = await window.electronAPI.saveProjectFile(xmlText, currentOpenFilePath);
  if (response.success) {
    currentOpenFilePath = response.filePath;
    alert("Đã lưu dự án thành công!");
  } else if (response.error) {
    alert("Lỗi khi lưu dự án: " + response.error);
  }
});

// Nhận sự kiện từ menu "Lưu dưới dạng..."
window.electronAPI.onSaveProjectAs(async () => {
  const xml = Blockly.Xml.workspaceToDom(workspace);
  const xmlText = Blockly.Xml.domToText(xml);
  const response = await window.electronAPI.saveProjectFileAs(xmlText);
  if (response.success) {
    currentOpenFilePath = response.filePath;
    alert("Đã lưu dự án thành công!");
  } else if (response.error) {
    alert("Lỗi khi lưu dự án: " + response.error);
  }
});

// Xử lý sự kiện nhấn nút Nạp Code
const uploadBtn = document.getElementById('upload-btn');
const comPortSelect = document.getElementById('com-port-select');
let isUploadInProgress = false;

function getUploadErrorSummary(message) {
  const text = String(message || 'Không thể nạp code.');
  const compileErrors = text
    .split(/\r?\n/)
    .filter(line => /(?:^|:)\s*(?:fatal\s+)?error:/i.test(line))
    .slice(0, 3)
    .map(line => line.trim());
  return compileErrors.length > 0 ? compileErrors.join('\n') : text.slice(0, 1200);
}

function validateWorkspaceForUpload() {
  const topBlocks = workspace.getTopBlocks(false);
  const startBlocks = topBlocks.filter(block => block.type === 'esp32_start');
  if (startBlocks.length === 0) {
    throw new Error("Bạn cần sử dụng khối 'Khởi động Robot' làm khối chính!");
  }
  if (startBlocks.length > 1) {
    throw new Error("Chỉ được dùng một khối 'Khởi động Robot' trong mỗi dự án.");
  }

  const allowedTopLevelTypes = new Set([
    'esp32_start',
    'retocar_event_button',
    'procedures_defnoreturn',
    'procedures_defreturn'
  ]);
  const disconnectedBlocks = topBlocks.filter(block => !allowedTopLevelTypes.has(block.type));
  if (disconnectedBlocks.length > 0) {
    disconnectedBlocks[0].select();
    workspace.centerOnBlock(disconnectedBlocks[0].id);
    throw new Error(
      `Có ${disconnectedBlocks.length} khối lệnh đang nằm ngoài khối 'Khởi động Robot'. ` +
      'Khối đầu tiên đã được chọn; hãy kéo khối đó vào chương trình rồi nạp lại.'
    );
  }
}

window.electronAPI.onUploadProgress((progress) => {
  if (!isUploadInProgress) return;
  if (progress.status === 'error') {
    uploadBtn.innerText = '❌ Nạp không thành công';
    uploadBtn.style.backgroundColor = '#dc3545';
    uploadBtn.setAttribute('aria-label', progress.message || 'Nạp code không thành công');
    return;
  }
  const percent = Math.max(0, Math.min(100, Number(progress.percent) || 0));
  uploadBtn.innerText = `Đang nạp code: ${percent}%`;
  uploadBtn.setAttribute('aria-label', progress.message || `Đang nạp code: ${percent}%`);
});

uploadBtn.addEventListener('click', async () => {
  if (window.electronAPI.isWeb && !window.electronAPI.supportsCodeUpload) {
    alert("Nạp Code chưa hoạt động trên web vì cần máy chủ biên dịch chương trình cho ESP32. Phần soạn và lưu/mở dự án vẫn dùng bình thường.");
    return;
  }

  if (isUploadInProgress) return;
  isUploadInProgress = true;
  uploadBtn.disabled = true;
  comPortSelect.disabled = true;
  uploadBtn.innerText = "Đang nạp code: 0%";

  try {
    validateWorkspaceForUpload();

    // Sinh code từ tất cả các khối trên màn hình
    let finalCppCode = Blockly.JavaScript.workspaceToCode(workspace);

    // Ép kiểu biến JavaScript (var) thành kiểu (float) của C++
    finalCppCode = finalCppCode.replace(/^var /gm, 'float ');

    const selectedPort = comPortSelect.value;
    if (!selectedPort) {
      throw new Error("Vui lòng đợi tải xong cổng COM hoặc cắm mạch vào!");
    }

    // Gửi đoạn code C++ này sang file main.js
    const response = await window.electronAPI.sendCodeToESP32(finalCppCode, selectedPort);
    if (!response || !response.success) {
      throw new Error(response && response.message ? response.message : "Không thể nạp code.");
    }
    uploadBtn.innerText = "✅ Nạp Thành Công!";
    uploadBtn.style.backgroundColor = "#28a745"; // Màu xanh lá
    setTimeout(() => {
      uploadBtn.disabled = false;
      uploadBtn.innerText = "Nạp Code";
      uploadBtn.style.backgroundColor = ""; // Reset
    }, 3000);
  } catch (error) {
    uploadBtn.innerText = "❌ Nạp không thành công";
    uploadBtn.style.backgroundColor = "#dc3545"; // Màu đỏ
    const errorSummary = getUploadErrorSummary(error.message);
    setTimeout(() => alert("Nạp code không thành công!\n\n" + errorSummary), 50);
    setTimeout(() => {
      uploadBtn.style.backgroundColor = "";
    }, 4000);
  } finally {
    isUploadInProgress = false;
    uploadBtn.disabled = false;
    comPortSelect.disabled = false;
    setTimeout(() => {
      if (!isUploadInProgress) uploadBtn.innerText = "Nạp Code";
    }, 4000);
  }
});

let lastPorts = [];
let serialPortsRequestInFlight = false;

// Lấy danh sách cổng COM (hỗ trợ tự động cập nhật ngầm - quiet)
async function loadSerialPorts(quiet = false) {
  if (isUploadInProgress || serialPortsRequestInFlight) return;
  serialPortsRequestInFlight = true;
  const select = comPortSelect;
  const currentSelected = select.value;

  if (!quiet) {
    select.innerHTML = '<option value="">Đang tìm (vui lòng đợi 5-10s)...</option>';
  }

  try {
    // Thêm timeout 15 giây cho việc lấy COM port
    const fetchPorts = window.electronAPI.getSerialPorts();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000));

    const ports = await Promise.race([fetchPorts, timeoutPromise]);

    // Kiểm tra xem danh sách thực sự có thay đổi không (để tránh giật lag UI và mất lựa chọn)
    const portsSerialized = JSON.stringify(ports);
    const lastSerialized = JSON.stringify(lastPorts);
    if (portsSerialized === lastSerialized && quiet) {
      return; // Không đổi, giữ nguyên
    }
    lastPorts = ports || [];

    select.innerHTML = ''; // Xóa danh sách cũ
    if (ports && ports.length > 0) {
      ports.forEach(port => {
        const option = document.createElement('option');
        option.value = port;
        option.text = port;
        if (port === currentSelected) {
          option.selected = true;
        }
        select.appendChild(option);
      });
      // Tự động chọn cổng COM15 nếu chưa chọn cổng nào và có sẵn COM15
      if (!select.value) {
        const com15 = Array.from(select.options).find(opt => opt.value === 'COM15');
        if (com15) com15.selected = true;
      }
    } else {
      const option = document.createElement('option');
      option.value = "";
      option.text = "Không tìm thấy thiết bị nào";
      select.appendChild(option);
    }
  } catch (error) {
    if (!quiet) {
      select.innerHTML = '<option value="">Lỗi tải cổng COM (Thử cắm lại cáp)</option>';
    }
  } finally {
    serialPortsRequestInFlight = false;
  }
}

if (window.electronAPI.isWeb && !window.electronAPI.supportsCodeUpload) {
  uploadBtn.title = 'Cần máy chủ biên dịch ESP32 để nạp code trực tiếp trên web';
} else {
  // Gọi hàm lấy cổng COM ngay lập tức (hiển thị Đang tìm)
  loadSerialPorts(false);

  // Quét cổng vừa đủ thường xuyên và tạm dừng hoàn toàn trong lúc biên dịch/nạp.
  setInterval(() => {
    // Chỉ cập nhật khi người dùng đang mở tab ứng dụng hoạt động
    if (document.hasFocus() && !isUploadInProgress) {
      loadSerialPorts(true);
    }
  }, 10000);
}

// --- BẢNG THEO DÕI CẢM BIẾN THỜI GIAN THỰC ---
const sensorMonitorToggle = document.getElementById('sensor-monitor-toggle');
const sensorMonitorPanel = document.getElementById('sensor-monitor-panel');
const sensorMonitorStatus = document.getElementById('sensor-monitor-status');
let sensorMonitorTimer = null;
let sensorMonitorStarting = false;

function setSensorValue(id, value, suffix = '') {
  const element = document.getElementById(id);
  if (element) element.textContent = value === undefined || value === null ? '--' : `${value}${suffix}`;
}

function renderSensorData(data) {
  setSensorValue('sensor-light', data.light);
  setSensorValue('sensor-ultrasonic', data.ultrasonic, ' cm');
  setSensorValue('sensor-line1', data.line1);
  setSensorValue('sensor-line2', data.line2);
  setSensorValue('sensor-line3', data.line3);
  setSensorValue('sensor-button1', data.button1);
  setSensorValue('sensor-button2', data.button2);
}

async function ensureSensorMonitorStarted(port) {
  if (sensorMonitorStarting) return;
  sensorMonitorStarting = true;
  try {
    await window.electronAPI.startSensorMonitor(port);
  } finally {
    sensorMonitorStarting = false;
  }
}

async function refreshSensorMonitor() {
  if (!sensorMonitorToggle?.checked) return;
  const port = comPortSelect.value;
  if (!port) {
    sensorMonitorStatus.textContent = 'Hãy chọn cổng COM của robot.';
    return;
  }

  try {
    const result = await window.electronAPI.getSensorMonitorData();
    if (!result.running || result.port !== port) {
      sensorMonitorStatus.textContent = isUploadInProgress
        ? 'Đang nạp code, bảng sẽ tự kết nối lại...'
        : 'Đang mở cổng theo dõi cảm biến...';
      if (!isUploadInProgress) await ensureSensorMonitorStarted(port);
      return;
    }

    if (!result.data) {
      sensorMonitorStatus.textContent = result.error
        ? result.error
        : 'Đã kết nối · hãy nạp lại chương trình để nhận dữ liệu.';
      return;
    }

    renderSensorData(result.data);
    const age = Date.now() - Number(result.data.timestamp || 0);
    sensorMonitorStatus.textContent = age < 3000
      ? `Đang cập nhật từ ${port}`
      : 'Chưa nhận được dữ liệu mới từ robot.';
  } catch (error) {
    sensorMonitorStatus.textContent = /404|không tìm thấy chức năng/i.test(error.message)
      ? 'Cần cài Retoblock Uploader 0.2.0 để theo dõi cảm biến.'
      : `Không thể đọc cảm biến: ${error.message}`;
  }
}

async function setSensorMonitorEnabled(enabled) {
  sensorMonitorPanel.hidden = !enabled;
  if (sensorMonitorTimer) {
    clearInterval(sensorMonitorTimer);
    sensorMonitorTimer = null;
  }

  if (!enabled) {
    try {
      await window.electronAPI.stopSensorMonitor?.();
    } catch (_) {
      // Cầu nối có thể đã đóng; không cần báo lỗi khi người dùng tắt bảng.
    }
    return;
  }

  if (!window.electronAPI.supportsSensorMonitor) {
    sensorMonitorStatus.textContent = 'Phiên bản này chưa hỗ trợ theo dõi cảm biến.';
    return;
  }
  await refreshSensorMonitor();
  sensorMonitorTimer = setInterval(refreshSensorMonitor, 500);
}

sensorMonitorToggle?.addEventListener('change', () => {
  setSensorMonitorEnabled(sensorMonitorToggle.checked);
});

comPortSelect?.addEventListener('change', async () => {
  if (!sensorMonitorToggle?.checked) return;
  try {
    await window.electronAPI.stopSensorMonitor?.();
  } catch (_) {
    // refreshSensorMonitor sẽ thử mở lại trên cổng mới.
  }
  refreshSensorMonitor();
});

// --- LOGIC DIALOG TẠO KHỐI TỰ ĐỊNH NGHĨA (MBLOCK STYLE) ---
let previewItems = [];
let numCount = 0;
let textCount = 0;
let boolCount = 0;
let labelCount = 0;
let editingIndex = -1;

const modal = document.getElementById('custom-block-modal');
const previewContainer = document.getElementById('scratch-block-preview');

function openCustomBlockModal(ws) {
  previewItems = [
    { type: 'label', value: 'tên khối' }
  ];
  numCount = 0;
  textCount = 0;
  boolCount = 0;
  labelCount = 0;
  editingIndex = -1;
  
  document.getElementById('chk-no-refresh').checked = false;
  document.getElementById('chk-has-return').checked = false;
  
  renderCustomBlockPreview();
  modal.style.display = 'flex';
}

function renderCustomBlockPreview() {
  previewContainer.innerHTML = '';
  
  previewItems.forEach((item, index) => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.margin = '14px 4px 4px 4px';

    // Thêm nút thùng rác màu cam ở phía trên nếu có nhiều phần tử (để xóa khi thêm sai)
    if (previewItems.length > 1 && index > 0) {
      const trashBtn = document.createElement('div');
      trashBtn.className = 'preview-trash-btn';
      trashBtn.style.position = 'absolute';
      trashBtn.style.top = '-20px';
      trashBtn.style.cursor = 'pointer';
      trashBtn.style.color = '#ff5c00';
      trashBtn.style.transition = 'transform 0.15s';
      trashBtn.title = 'Xóa phần tử này';
      trashBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5c00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>`;

      trashBtn.onmouseover = () => trashBtn.style.transform = 'scale(1.25)';
      trashBtn.onmouseout = () => trashBtn.style.transform = 'scale(1)';

      trashBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        previewItems.splice(index, 1);
        renderCustomBlockPreview();
      });
      wrapper.appendChild(trashBtn);
    }

    const itemEl = document.createElement('span');
    
    if (item.type === 'label') {
      itemEl.className = 'editable-label';
      itemEl.innerText = item.value;
    } else if (item.type === 'num') {
      itemEl.className = 'preview-param-num';
      itemEl.innerText = item.value;
    } else if (item.type === 'text') {
      itemEl.className = 'preview-param-text';
      itemEl.innerText = item.value;
    } else if (item.type === 'bool') {
      itemEl.className = 'preview-param-bool';
      itemEl.innerText = item.value;
    }
    
    // Bật chế độ chỉnh sửa trực tiếp khi click vào nhãn hoặc tham số
    itemEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (editingIndex === index) return;
      editingIndex = index;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.value = item.value;
      input.style.width = Math.max(40, item.value.length * 8 + 10) + 'px';
      
      itemEl.innerHTML = '';
      itemEl.appendChild(input);
      input.focus();
      input.select();
      
      const finishEdit = () => {
        const val = input.value.trim();
        if (val !== '') {
          item.value = val;
        }
        editingIndex = -1;
        renderCustomBlockPreview();
      };
      
      input.addEventListener('blur', finishEdit);
      input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          finishEdit();
        }
      });
    });
    
    wrapper.appendChild(itemEl);
    previewContainer.appendChild(wrapper);
  });
}

// Bắt sự kiện click vào các thẻ thêm tham số/nhãn
document.getElementById('btn-add-num').addEventListener('click', () => {
  numCount++;
  previewItems.push({ type: 'num', value: 'số' + numCount });
  renderCustomBlockPreview();
});

document.getElementById('btn-add-text').addEventListener('click', () => {
  textCount++;
  previewItems.push({ type: 'text', value: 'văn bản' + textCount });
  renderCustomBlockPreview();
});

document.getElementById('btn-add-bool').addEventListener('click', () => {
  boolCount++;
  previewItems.push({ type: 'bool', value: 'đúng_sai' + boolCount });
  renderCustomBlockPreview();
});

document.getElementById('btn-add-label').addEventListener('click', () => {
  labelCount++;
  previewItems.push({ type: 'label', value: 'nhãn' + labelCount });
  renderCustomBlockPreview();
});

// Đóng modal
const hideModal = () => {
  modal.style.display = 'none';
};
document.getElementById('modal-close-btn').addEventListener('click', hideModal);
document.getElementById('modal-btn-cancel').addEventListener('click', hideModal);

// Xác nhận tạo khối khi click OK
document.getElementById('modal-btn-ok').addEventListener('click', () => {
  // Tìm label đầu tiên làm tên của khối lệnh
  const firstLabel = previewItems.find(item => item.type === 'label');
  const funcName = firstLabel ? firstLabel.value.trim() : 'ten_khoi';
  
  // Trích xuất danh sách tất cả các tham số (num, text, bool)
  const args = previewItems
    .filter(item => item.type !== 'label')
    .map(item => item.value.trim());
    
  const hasReturn = document.getElementById('chk-has-return').checked;
  const blockType = hasReturn ? 'procedures_defreturn' : 'procedures_defnoreturn';
  
  const block = workspace.newBlock(blockType);
  block.setFieldValue(funcName, 'NAME');
  
  if (args.length > 0) {
    const xmlElement = Blockly.utils.xml.textToDom(
      `<mutation>${args.map((name, index) => `<arg name="${name}" id="ARG_${index}"></arg>`).join('')}</mutation>`
    );
    block.domToMutation(xmlElement);
  }
  
  block.initSvg();
  block.render();
  block.select();
  
  hideModal();
});

// Đăng ký ghi đè callback tạo khối mới của Blockly
if (Blockly.Procedures) {
  Blockly.Procedures.createProcedureButtonHandler = function(ws) {
    openCustomBlockModal(ws);
  };
}

