var express = require('express');
var router = express.Router();

const api = require('./api');

const home = require('./home');
const users = require('./users');

router.use('/api', api);

router.use('/', home);
router.use('/users', users);

module.exports = router;
