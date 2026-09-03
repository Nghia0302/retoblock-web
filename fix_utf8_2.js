const fs = require('fs');
let path = 'renderer.js';
let content = fs.readFileSync(path, 'utf8');

// Use regex to replace 0_forward_decls content
const regex = /Blockly\.JavaScript\.definitions_\['0_forward_decls'\] = `([^`]+)`/s;
const replacement = `Blockly.JavaScript.definitions_['0_forward_decls'] = \`#include <Arduino.h>
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
\``;

content = content.replace(regex, replacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Update success');
