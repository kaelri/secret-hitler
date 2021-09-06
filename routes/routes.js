const express = require('express');
const router  = express.Router();
const User    = require('../modules/user');
const Game    = require('../modules/game');
const Socket  = require('../modules/socket');

/* GET home page. */
router.get('/', async function(req, res, next) {

	vueData = {
		socketURL: `${process.env.APP_URL}:${process.env.WS_PORT}`
	}

	res.render('index', {
		title:   'Secret Hitler',
		vueURL:  ( process.env.NODE_ENV == 'development' ) ? '//cdn.jsdelivr.net/npm/vue/dist/vue.js' : '//cdn.jsdelivr.net/npm/vue',
		vueData: vueData,
	});

});

// USERS

router.post('/rest/user/new', async function register(req, res, next) {

	const name     = String( req.body.name     ).trim(),
		  email    = String( req.body.email    ).trim(),
		  display  = String( req.body.display  ).trim(),
		  password = String( req.body.password ).trim(),
		  roles    = [ 'player' ];

	let user;

	try {

		// Check if user exists.
		let userExists = await User.exists( name );

		if ( userExists ) {

			return res.status(400).send({
				code:    'user-exists',
				message: `A user is already registered with the name “${name}”.`
			});
	
		}

		// Create user.
		user = await User.create({
			name:     name,
			email:    email,
			display:  display,
			roles:    roles,
			password: password,
		});

	} catch (error) {

		return res.status(500).send({
			code:    'database-error',
			message: error.message,
			stack:   error.stack
		});

	}

	// Finish.
	req.session.userID = user.id;

	return res.status(200).send({
		user: user.export()
	});

});

router.post('/rest/user/login', async function login(req, res, next) {

	const name     = String( req.body.name     ).trim(),
		  password = String( req.body.password ).trim();

	// Check if user exists.
	let user;

	try {

		user = await User.get( 'name', name );

	} catch (error) {

		return res.status(500).send({
			code:    'database-error',
			message: error.message,
			stack:   error.stack
		});

	}

	if ( !user ) {

		return res.status(400).send({
			code:    'bad-credentials',
			message: 'The username or password is incorrect.'
		});

	}

	// Validate password.
	let passwordValid = user.validatePassword( password );
	
	if ( !passwordValid ) {

		return res.status(400).send({
			code:    'bad-credentials',
			message: 'The username or password is incorrect.'
		});

	}

	// Finish.
	req.session.userID = user.id;

	return res.status(200).send({
		user: user.export()
	});

});

router.post('/rest/user/logout', async function logout(req, res, next) {

	req.session.destroy(function(){
		res.status(200).send({});
	});

});

router.post('/rest/user/get', async function getUser( req, res, next ) {

	// Get user.
	const user = await User.getCurrent( req );

	if ( !user ) {

		return res.status(400).send({
			code:    'not-logged-in',
			message: 'You are not logged in.'
		});

	}

	return res.status(200).send({
		user: user.export()
	});

});

// GAMES

router.post('/rest/game/new', async function newGame( req, res, next ) {

	const name = String( req.body.name || '' ).trim(),
		  user = await User.getCurrent( req );

	if ( !user ) {

		return res.status(400).send({
			code:    'not-logged-in',
			message: 'You must be logged in to create a new game.'
		});

	}

	let game;

	try {

		game = await Game.create({
			name:  name,
			owner: user.id
		});

	} catch (error) {

		return res.status(500).send({
			code:    'database-error',
			message: error.message,
			stack:   error.stack
		});

	}

	return res.status(200).send({
		game: game.export()
	});

});

// DEV

router.post('/rest/dev/message', async function newGame( req, res, next ) {

	const text = String( req.body.text || '' ).trim();

	Socket.io.emit( 'dev-message', text );

	return res.status(200).send();

});

module.exports = router;
