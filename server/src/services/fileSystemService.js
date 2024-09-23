const fs = require('fs').promises;
const path = require('path');

const ROOT_DIR = process.env.ROOT_DIR || '/';

const sanitizePath = (userPath) => {
  const safePath = path.normalize(userPath).replace(/^(\.\.(\/|\\|$))+/, '');
  return path.join(ROOT_DIR, safePath);
};

exports.listDirectory = async (dirPath) => {
  const fullPath = sanitizePath(dirPath);
  const files = await fs.readdir(fullPath, { withFileTypes: true });
  return files.map(file => ({
    name: file.name,
    isDirectory: file.isDirectory(),
    size: file.isFile() ? fs.stat(path.join(fullPath, file.name)).then(stat => stat.size) : null,
    modified: fs.stat(path.join(fullPath, file.name)).then(stat => stat.mtime)
  }));
};

exports.readFile = async (filePath) => {
  const fullPath = sanitizePath(filePath);
  return fs.readFile(fullPath, 'utf-8');
};

exports.writeFile = async (filePath, content) => {
  const fullPath = sanitizePath(filePath);
  await fs.writeFile(fullPath, content, 'utf-8');
};

exports.deleteFile = async (filePath) => {
  const fullPath = sanitizePath(filePath);
  await fs.unlink(fullPath);
};