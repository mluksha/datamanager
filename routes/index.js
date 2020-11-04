var express = require('express');
var router = express.Router();

const api = require('./api');
const home = require('./home');
const users = require('./users');
const documents = require('./documents');

router.use('/api', api);

router.use('/', home);
router.use('/users', users);
router.use('/documents', documents);

module.exports = router;
