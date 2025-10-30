const fs = require('fs');
const path = require('path');

console.log('Building fcuk.js...');

// Read the source file
const srcPath = path.join(__dirname, 'src', 'index.js');
const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

let sourceCode = fs.readFileSync(srcPath, 'utf8');

// Create browser-compatible version (remove Node.js specific code)
const browserCode = sourceCode
  .replace(/import fcuk from.*?;/g, '') // Remove import statements
  .replace(/export default fcuk;/g, '') // Remove export
  .replace(/if \(typeof module.*?\n.*?\n.*?\n.*?\n}/g, '// Browser version'); // Remove Node.js exports

// Create UMD wrapper for browser
const umdWrapper = `(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node.js
    module.exports = factory();
  } else {
    // Browser globals
    root.fcuk = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

${browserCode}

return fcuk;
}));`;

// Write unminified version
fs.writeFileSync(path.join(distDir, 'fcuk.js'), umdWrapper);

// Create a simple minified version (basic minification)
const minified = umdWrapper
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
  .replace(/\/\/.*$/gm, '') // Remove line comments
  .replace(/\s+/g, ' ') // Collapse whitespace
  .replace(/;\s*}/g, ';}') // Remove spaces before closing braces
  .trim();

fs.writeFileSync(path.join(distDir, 'fcuk.min.js'), minified);

console.log('✅ Built fcuk.js and fcuk.min.js in dist/');
console.log(`📦 Unminified: ${fs.statSync(path.join(distDir, 'fcuk.js')).size} bytes`);
console.log(`📦 Minified: ${fs.statSync(path.join(distDir, 'fcuk.min.js')).size} bytes`);