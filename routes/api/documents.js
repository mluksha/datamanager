var express = require('express');
var router = express.Router();

const documentsController = require('../../controllers/api/documentsController');

router.get('/checkUpdates', documentsController.checkUpdates);

module.exports = router;
