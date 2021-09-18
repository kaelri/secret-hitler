const express = require('express');
const router  = express.Router();
const User    = require('../modules/user');
const Game    = require('../modules/game');
const Socket  = require('../modules/socket');

/* GET home page. */
router.get('/', async function(req, res, next) {

	const useLocalScripts = ( process.env.APP_LOCAL_LIB && process.env.APP_LOCAL_LIB === 'true'        );
	const useDevScripts   = ( process.env.NODE_ENV      && process.env.NODE_ENV      === 'development' );

	res.render('index', {
		title:          'Secret Hitler',
		vueURL:         useLocalScripts ? ( useDevScripts ? '/lib/vue/vue.js' : '/lib/vue/vue.min.js' ) : ( useDevScripts ? 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js' : 'https://cdn.jsdelivr.net/npm/vue@2.6.14' ),
		googleFontsURL: useLocalScripts ? '/lib/google-fonts/google-fonts.css' : 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Germania+One&display=swap',
		axiosURL:       useLocalScripts ? '/lib/axios/axios.min.js' : 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
		socketURL:      useLocalScripts ? '/lib/socket-io/socket.io.min.js' : 'https://cdn.socket.io/4.1.2/socket.io.min.js',
		fontAwesomeURL: useLocalScripts ? '/lib/font-awesome/all.min.js' : 'https://use.fontawesome.com/releases/v5.15.2/js/all.js',
	});

});

// CLIENT

router.post('/rest/client/get', async function getUser( req, res, next ) {

	const user = await User.getCurrent( req );

	if ( user ) {
		await user.fetchGames();
	}

	return res.status(200).send({
		code:      'success',
		appURL:    process.env.APP_URL,
		socketURL: `${process.env.APP_URL}:${process.env.WS_PORT}`,
		user:      user ? user.export() : null,
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

			return res.status(200).send({
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
		code: 'success',
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

		return res.status(200).send({
			code: 'bad-credentials'
		});

	}

	// Validate password.
	let passwordValid = user.validatePassword( password );
	
	if ( !passwordValid ) {

		return res.status(200).send({
			code: 'bad-credentials'
		});

	}

	// Fetch user’s active games.
	await user.fetchGames();

	// Finish.
	req.session.userID = user.id;

	return res.status(200).send({
		code: 'success',
		user: user.export()
	});

});

router.post('/rest/user/logout', async function logout(req, res, next) {

	req.session.destroy(function(){
		res.status(200).send({
			code: 'success'
		});
	});

});

// GAMES

router.post('/rest/game/new', async function newGame( req, res, next ) {

	const name = String( req.body.name || '' ).trim(),
		  user = await User.getCurrent( req );

	if ( !user ) {

		return res.status(400).send({
			code: 'not-logged-in'
		});

	}

	let game;

	try {

		game = await Game.create({
			name: name,
			user: user,
		});

		// Fetch user’s active games.
		await user.fetchGames();

	} catch (error) {

		return res.status(500).send({
			code:    'database-error',
			message: error.message,
			stack:   error.stack
		});

	}

	return res.status(200).send({
		code: 'success',
		user: user.export(),
		game: game.export()
	});

});

router.post('/rest/game/join', async function newGame( req, res, next ) {

	const code = String( req.body.code || '' ).trim(),
		  user = await User.getCurrent( req );

	if ( !user ) {

		return res.status(400).send({
			code: 'not-logged-in'
		});

	}

	let game;

	try {

		game = await Game.get( 'code', code );
		
		if ( !game ) {

			return res.status(200).send({
				code: 'game-not-found'
			});

		}

		await game.addPlayer( user.id );

		await user.fetchGames();

	} catch (error) {

		return res.status(500).send({
			code:    'database-error',
			message: error.message,
			stack:   error.stack
		});

	}

	return res.status(200).send({
		code: 'success',
		user: user.export(),
		game: game.export()
	});

});

router.post('/rest/game/play', async function newGame( req, res, next ) {

	const name = String( req.body.name || '' ).trim(),
		  user = await User.getCurrent( req );

	if ( !user ) {

		return res.status(400).send({
			code: 'not-logged-in'
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

	await user.fetchGames();

	return res.status(200).send({
		code: 'success',
		user: user.export(),
		game: game.export()
	});

});

// DEV

router.post('/rest/dev/message', async function newGame( req, res, next ) {

	const text = String( req.body.text || '' ).trim();

	Socket.io.emit( 'dev-message', text );

	return res.status(200).send({
		code: 'success',
	});

});

async function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

module.exports = router;
