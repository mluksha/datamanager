var express = require('express');
var router = express.Router();

const documentController = require('../../controllers/api/documentController');

router.route('/')
  .all(function (req, res, next) {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
    next()
  })
  .get(documentController.getDocument)
  .put(function (req, res, next) {
    next(new Error('not implemented'))
  })
  .post(function (req, res, next) {
    next(new Error('not implemented'))
  })
  .delete(function (req, res, next) {
    next(new Error('not implemented'))
  })

module.exports = router;
