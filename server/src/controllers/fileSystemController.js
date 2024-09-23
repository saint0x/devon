const fileSystemService = require('../services/fileSystemService');

exports.listDirectory = async (req, res, next) => {
  try {
    const { path } = req.query;
    const files = await fileSystemService.listDirectory(path);
    res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};

exports.readFile = async (req, res, next) => {
  try {
    const { path } = req.query;
    const content = await fileSystemService.readFile(path);
    res.status(200).send(content);
  } catch (error) {
    next(error);
  }
};

exports.writeFile = async (req, res, next) => {
  try {
    const { path, content } = req.body;
    await fileSystemService.writeFile(path, content);
    res.status(200).json({ message: 'File written successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const { path } = req.query;
    await fileSystemService.deleteFile(path);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
};