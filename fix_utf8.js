const fs = require('fs');
let path = 'renderer.js';
let content = fs.readFileSync(path, 'utf8');

const chunk1_target = `  Blockly.JavaScript.definitions_['0_forward_decls'] = \`#include <Arduino.h>

  void setMotorSpeed(int motor, int speed);
  void setHeadlight(int side, int state);
  void setRGB(int r, int g, int b);
  void playBuzzer(int freq, float time);
  long readUltrasonic();
  float getTimer();
  void resetTimer();
  \`;`;

const chunk1_replace = `  Blockly.JavaScript.definitions_['0_forward_decls'] = \`#include <Arduino.h>
#include <Wire.h>

  void setMotorSpeed(int motor, int speed);
  void setHeadlight(int side, int state);
  void setRGB(int r, int g, int b);
  void playBuzzer(int freq, float time);
  long readUltrasonic();
  float getTimer();
  void resetTimer();
  void initServo();
  void writeServoAngle(int angle);
  void initColorSensor();
  String readColorSensor();
  \`;`;

content = content.replace(chunk1_target, chunk1_replace);

const chunk2_target = `void sensorTelemetryTask(void* arg) {`;
const chunk2_replace = `  String readColorSensor() {
    Wire.requestFrom(0x29, 8);
    if (Wire.available() == 8) {
      int c = Wire.read() | (Wire.read() << 8);
      int r = Wire.read() | (Wire.read() << 8);
      int g = Wire.read() | (Wire.read() << 8);
      int b = Wire.read() | (Wire.read() << 8);

      if (r > g * 1.5 && r > b * 1.5) return "RED";
      if (g > r * 1.5 && g > b * 1.5) return "GREEN";
      if (b > r * 1.5 && b > g * 1.5) return "BLUE";
      if (r > 100 && g > 100 && b < 100) return "YELLOW";
      if (r > 100 && g > 100 && b > 100) return "WHITE";
    }
    return "UNKNOWN";
  }

  void initColorSensor() {
    Wire.begin(21, 22);
    Wire.beginTransmission(0x29);
    Wire.write(0x80 | 0x00);
    Wire.write(0x03);
    Wire.endTransmission();
    delay(3);
    Wire.beginTransmission(0x29);
    Wire.write(0x80 | 0x14);
    Wire.endTransmission();
  }

  void initServo() {
    #if defined(ESP_ARDUINO_VERSION_MAJOR) && ESP_ARDUINO_VERSION_MAJOR >= 3
      ledcAttach(19, 50, 10);
    #else
      ledcSetup(7, 50, 10);
      ledcAttachPin(19, 7);
    #endif
  }

  void writeServoAngle(int angle) {
    if (angle < 0) angle = 0;
    if (angle > 180) angle = 180;
    int duty = (int)(((angle / 180.0) * 102.4) + 25.6);
    #if defined(ESP_ARDUINO_VERSION_MAJOR) && ESP_ARDUINO_VERSION_MAJOR >= 3
      ledcWrite(19, duty);
    #else
      ledcWrite(7, duty);
    #endif
  }

void sensorTelemetryTask(void* arg) {`;
content = content.replace(chunk2_target, chunk2_replace);

const chunk3_target = `void setup() {
    Serial.begin(115200);`;
const chunk3_replace = `void setup() {
    Serial.begin(115200);
    initServo();
    initColorSensor();`;
content = content.replace(chunk3_target, chunk3_replace);

const chunk4_target = `Blockly.JavaScript.forBlock['esp32_read_color'] = function(block) {
  return ['colorSensor.getColorName()', Blockly.JavaScript.ORDER_ATOMIC];
};`;
const chunk4_replace = `Blockly.JavaScript.forBlock['esp32_read_color'] = function(block) {
  return ['readColorSensor()', Blockly.JavaScript.ORDER_ATOMIC];
};`;
content = content.replace(chunk4_target, chunk4_replace);

fs.writeFileSync(path, content, 'utf8');
console.log('Update success');
