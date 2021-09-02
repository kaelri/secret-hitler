const User = require('./user');

exports.register = async function(req, res, next) {

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

};

exports.login = async function(req, res, next) {

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

};

exports.logout = async function (req, res, next) {

	req.session.destroy(function(){
		res.status(200).send({});
	});

}

exports.getLoggedInUser = async function ( req ) {

	// Get user.
	let id = req.session.userID || null;

	if ( !id ) return null;

	let user = await User.get( 'id', id );

	return user;

}
