const fs = require('fs-extra');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
fs.ensureDirSync(DATA_DIR);

function readJSON(name, fallback = {}) {
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) { fs.writeJsonSync(file, fallback, { spaces: 2 }); return fallback; }
  try { return fs.readJsonSync(file); } catch { return fallback; }
}

function writeJSON(name, data) {
  fs.writeJsonSync(path.join(DATA_DIR, `${name}.json`), data, { spaces: 2 });
}

module.exports = { readJSON, writeJSON, DATA_DIR };
