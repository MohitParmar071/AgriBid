const fs = require('fs');
let content = fs.readFileSync('public/css/home.css', 'utf8');
const lines = content.split('\n');
let newLines = lines.slice(0, 512);

newLines.push('  font-weight: 800;');
newLines.push('  width: 20px;');
newLines.push('  height: 20px;');
newLines.push('  display: flex;');
newLines.push('  align-items: center;');
newLines.push('  justify-content: center;');
newLines.push('  border-radius: 50%;');
newLines.push('  box-shadow: 0 2px 6px rgba(0,0,0,0.3);');
newLines.push('  border: 2px solid #2e7d32;');
newLines.push('}');
newLines.push('');

let endLines = lines.slice(718);
newLines = newLines.concat(endLines);

fs.writeFileSync('public/css/home.css', newLines.join('\n'));
