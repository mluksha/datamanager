var express = require('express');
var router = express.Router();

const documents = require('./documents');

router.use('/documents', documents);

module.exports = router;
