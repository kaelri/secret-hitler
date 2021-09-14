const express = require('express');
const router  = express.Router();
const User    = require('../modules/user');
const Game    = require('../modules/game');
const Socket  = require('../modules/socket');

/* GET home page. */
router.get('/', async function(req, res, next) {

	let useLocalScripts = ( process.env.APP_LOCAL_LIB && process.env.APP_LOCAL_LIB === 'true'        );
	let useDevScripts   = ( process.env.NODE_ENV      && process.env.NODE_ENV      === 'development' );

	let googleFontsURL;
	let fontAwesomeURL;
	let vueURL;
	let socketURL;

	if ( useLocalScripts ) {
		googleFontsURL = '/lib/google-fonts/google-fonts.css';
		vueURL         = useDevScripts ? '/lib/vue/vue.js' : '/lib/vue/vue.min.js';
		socketURL      = '/lib/socket-io/socket.io.min.js';
		fontAwesomeURL = '/lib/font-awesome/all.min.js';
	} else {
		googleFontsURL = 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Germania+One&display=swap';
		vueURL         = useDevScripts ? '//cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js' : '//cdn.jsdelivr.net/npm/vue@2.6.14';
		socketURL      = '//cdn.socket.io/4.1.2/socket.io.min.js';
		fontAwesomeURL = '//use.fontawesome.com/releases/v5.15.2/js/all.js';
	}

	res.render('index', {
		title:          'Secret Hitler',
		googleFontsURL: googleFontsURL,
		fontAwesomeURL: fontAwesomeURL,
		vueURL:         vueURL,
		socketURL:      socketURL,
	});

});

// CLIENT

router.post('/rest/client/get', async function getUser( req, res, next ) {

	const user = await User.getCurrent( req );

	if ( user ) {
		await user.fetchGames();
	}

	const data = {
		appURL:    process.env.APP_URL,
		socketURL: `${process.env.APP_URL}:${process.env.WS_PORT}`,
		user:      user ? user.export() : null,
	};

	return res.status(200).send(data);

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

	// Fetch user’s active games.
	await user.fetchGames();

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

	// Fetch user’s active games.
	await user.fetchGames();

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

async function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

module.exports = router;
