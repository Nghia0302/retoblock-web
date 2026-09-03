const fs = require('fs');
let path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

const target1 = `    function switchDevice(device) {
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
    }`;

const replace1 = `    let retobot2CategoryHTML = '<category name="Mở rộng 2.0" colour="#ff5722" id="cat_retobot2"><block type="esp32_servo"></block><block type="esp32_read_color"></block></category>';
    function switchDevice(device) {
      document.getElementById('btn-dev-retobot').classList.remove('active');
      document.getElementById('btn-dev-retobot2').classList.remove('active');
      document.getElementById('btn-dev-' + device).classList.add('active');
      
      const toolbox = document.getElementById('toolbox');
      let cat2 = document.getElementById('cat_retobot2');
      
      if (device === 'retobot2') {
        if (!cat2) {
          toolbox.insertAdjacentHTML('beforeend', retobot2CategoryHTML);
        }
      } else {
        if (cat2) {
          cat2.remove();
        }
      }
      
      if (typeof workspace !== 'undefined') {
        workspace.updateToolbox(toolbox);
      }
    }
    
    // Khởi tạo mặc định
    window.addEventListener('load', () => {
      let cat2 = document.getElementById('cat_retobot2');
      if (cat2) {
        cat2.remove(); // Xoá mặc định vì ban đầu là Retobot thường
      }
    });`;

content = content.replace(target1, replace1);

const target2 = `<category name="Mở rộng 2.0" colour="#ff5722" id="cat_retobot2" style="display: none;">`;
const replace2 = `<category name="Mở rộng 2.0" colour="#ff5722" id="cat_retobot2">`;

content = content.replace(target2, replace2);
fs.writeFileSync(path, content, 'utf8');
console.log('index.html fixed');
