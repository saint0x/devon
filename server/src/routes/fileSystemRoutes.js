const express = require('express');
const fileSystemController = require('../controllers/fileSystemController');

const router = express.Router();

router.get('/list', fileSystemController.listDirectory);
router.get('/read', fileSystemController.readFile);
router.post('/write', fileSystemController.writeFile);
router.delete('/delete', fileSystemController.deleteFile);

module.exports = router;