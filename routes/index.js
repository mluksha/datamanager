var express = require('express');
var router = express.Router();

const home = require('./home');
const users = require('./users');

router.use('/', home);
router.use('/users', users);

module.exports = router;
