const fs = require('fs');
let path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

const target = `<category name="Mở rộng 2.0" colour="#ff5722" id="cat_retobot2"><block type="esp32_servo"></block><block type="esp32_read_color"></block></category>`;
const replace = `<category name="Mở rộng 2.0" colour="#ff5722" id="cat_retobot2"><block type="esp32_servo"></block><block type="esp32_read_color"></block><block type="esp32_check_color"></block></category>`;

content = content.replace(target, replace);
fs.writeFileSync(path, content, 'utf8');
console.log('Added block to index.html');
