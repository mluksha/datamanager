var express = require('express');
var router = express.Router();

const documentsApiController = require('../../controllers/api/documentsApiController');

router.get('/checkUpdates', documentsApiController.checkUpdates);

module.exports = router;
