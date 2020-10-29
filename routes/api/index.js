var express = require('express');
var router = express.Router();


const document = require('./document');

router.use('/document', document);

module.exports = router;
