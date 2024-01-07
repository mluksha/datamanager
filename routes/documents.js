var express = require('express');
var router = express.Router();

const documentsController = require('../controllers/documentsController');

router.get('/', documentsController.getAll);
router.get('/:id', documentsController.getDocument);
router.get('/:id/typescript', documentsController.documentTypeScript);

module.exports = router;
