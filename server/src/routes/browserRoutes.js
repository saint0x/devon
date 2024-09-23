const express = require('express');
const browserController = require('../controllers/browserController');

const router = express.Router();

router.post('/', browserController.browsePage);

module.exports = router;