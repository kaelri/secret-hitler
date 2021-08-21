var express = require('express');
var router  = express.Router();
var path    = require('path');
var session = require('express-session');
var mysql   = require('mysql');

router.get('/login', function(req, res, next) {
  // req.body.username
  // req.body.password
});

module.exports = router;
