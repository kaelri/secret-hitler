const express  = require('express');
const router   = express.Router();
const auth     = require('../modules/auth');

/* GET home page. */
router.get('/', async function(req, res, next) {

	let user;

	try {

		user = await auth.getLoggedInUser( req.session );

	} catch (error) {

		console.error( error.message );

	}

	res.render('index', {
		title:   'Secret Hitler',
		vueURL:  ( process.env.NODE_ENV == 'development' ) ? '//cdn.jsdelivr.net/npm/vue/dist/vue.js' : '//cdn.jsdelivr.net/npm/vue',
		vueData: {
			user: user
		}
	});

});

module.exports = router;
