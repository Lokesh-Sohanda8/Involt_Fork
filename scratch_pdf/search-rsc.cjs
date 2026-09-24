const fs = require('fs');
const content = fs.readFileSync('node_modules/vinext/dist/index.js', 'utf8');
const regex = /environments/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(content.substring(Math.max(0, match.index - 50), match.index + 100));
}
