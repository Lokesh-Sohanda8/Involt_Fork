const fs = require('fs');
const content = fs.readFileSync('.vercel/output/functions/__server.func/_ssr/ssr.mjs', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('await import(') && line.includes('.default(')) {
    console.log(`Line ${i}:`, line.substring(Math.max(0, line.indexOf('await import(') - 50), line.indexOf('await import(') + 100));
  }
});
