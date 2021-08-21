var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title:   'Secret Hitler',
    vueURL:  ( process.env.NODE_ENV == 'development' ) ? '//cdn.jsdelivr.net/npm/vue/dist/vue.js' : '//cdn.jsdelivr.net/npm/vue',
    vueData: {
      loggedIn: req.session.loggedIn ?? false,
      user:     req.session.user     ?? null
    }
  });
});

module.exports = router;
