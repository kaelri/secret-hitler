const crypto   = require('crypto');
const database = require('../modules/database');

exports.register = async function(req, res, next) {

	const userName    = String( req.body.name     ).trim(),
	      userEmail   = String( req.body.email    ).trim(),
	      userDisplay = String( req.body.display  ).trim(),
	      password    = String( req.body.password ).trim(),
	      userRoles   = [ 'player' ],
		  connection  = database.getConnection();

	let userId,
	    userHash,
	    userSalt;
	    
	// Check if user exists.
	let userExists;

	try {

		userExists = await database.userExists( connection, userName );

	} catch (error) {

		return res.status(500).send({
			code:    'database-error',
			message: error.message,
			stack:   error.stack
		});

	}

	if ( userExists ) {

		return res.status(400).send({
			code: 'user-exists',
			message: `A user is already registered with the name “${userName}”.`
		});

	}

	// Create user.
	userSalt = crypto.randomBytes(16).toString('hex');
	userHash = crypto.pbkdf2Sync( password, userSalt, 1000, 64, `sha512`).toString(`hex`);

	try {

		userId = await database.createUser( connection, {
			name:    userName,
			hash:    userHash,
			salt:    userSalt,
			email:   userEmail,
			display: userDisplay,
			roles:   userRoles.join(','),
		});

	} catch (error) {

		return res.status(500).send({
			code:    'database-error',
			message: error.message,
			stack:   error.stack
		});

	}

	// Finish.
	connection.end();

	const user = {
		id:      userId,
		name:    userName,
		email:   userEmail,
		display: userDisplay,
		roles:   userRoles
	}

	req.session.userID = user.id;

	return res.status(200).send({
		user: user
	});

};

exports.login = async function(req, res, next) {

	const userName   = req.body.name,
	      password   = req.body.password,
		  connection = database.getConnection();

	// Check if user exists.
	let userData;

	try {

		userData = await database.getUserByName( connection, userName );

	} catch (error) {

		return res.status(500).send({
			code:    'database-error',
			message: error.message,
			stack:   error.stack
		});

	}

	if ( userData === false ) {

		return res.status(400).send({
			code: 'bad-credentials',
			message: `The username or password is incorrect.`
		});

	}

	// Validate password.
	let loginHash = crypto.pbkdf2Sync(password, userData.salt, 1000, 64, `sha512`).toString(`hex`);
	
	if ( loginHash != userData.hash ) {

		return res.status(400).send({
			code: 'bad-credentials',
			message: `The username or password is incorrect.`
		});

	}

	// Finish.
	connection.end();

	const user = {
		id:      userData.id,
		name:    userData.name,
		email:   userData.email,
		display: userData.display,
		roles:   userData.roles.split(',')
	}

	req.session.userID = user.id;

	return res.status(200).send({
		user: user
	});

};

exports.logout = async function (req, res, next) {

	req.session.destroy(function(){
		res.status(200).send({});
	});

}

exports.getLoggedInUser = async function ( session ) {

	// Get user.
	let userID = session.userID || null,
		user   = null;

	if ( !userID ) return null;

	const connection = database.getConnection();

	let userData;

	try {

		userData = await database.getUserByID( connection, userID );

	} catch (err) {

		console.error(err.message, err.stack);

	}

	connection.end();

	if ( !userData ) return null;

	user = {
		id:      userData.id,
		name:    userData.name,
		email:   userData.email,
		display: userData.display,
		roles:   userData.roles.split(',')
	}

	return user;

}
