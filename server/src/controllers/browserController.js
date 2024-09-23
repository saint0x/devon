const browserService = require('../services/browserService');

exports.browsePage = async (req, res, next) => {
  try {
    const { url, method, headers, data } = req.body;
    const result = await browserService.fetchPage(url, method, headers, data);
    res.status(result.status).send(result);
  } catch (error) {
    next(error);
  }
};