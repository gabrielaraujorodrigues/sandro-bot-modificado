const fs = require('fs-extra');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
fs.ensureDirSync(DATA_DIR);

function _pathFor(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readJSON(name, fallback) {
  const file = _pathFor(name);
  if (!fs.existsSync(file)) {
    fs.writeJsonSync(file, fallback, { spaces: 2 });
    return fallback;
  }
  try {
    return fs.readJsonSync(file);
  } catch (e) {
    return fallback;
  }
}

function writeJSON(name, data) {
  fs.writeJsonSync(_pathFor(name), data, { spaces: 2 });
}

module.exports = { readJSON, writeJSON, DATA_DIR };
