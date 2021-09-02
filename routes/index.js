const express  = require('express');
const router   = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {

	res.render('index', {
		title:   'Secret Hitler',
		vueURL:  ( process.env.NODE_ENV == 'development' ) ? '//cdn.jsdelivr.net/npm/vue/dist/vue.js' : '//cdn.jsdelivr.net/npm/vue',
	});

});

module.exports = router;
