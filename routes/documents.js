var express = require('express');
var router = express.Router();

const documentsController = require('../controllers/documentsController');

router.get('/', documentsController.getAll);
router.get('/:id', documentsController.getDocument);

module.exports = router;
