const database = require('../modules/database');

exports.create = async function(req, res, next) {

	const gameName    = String( req.body.name || '' ).trim(),
	      gameStatus  = 'new',
	      gameContent = {},
		  connection  = database.getConnection();

	// Check auth.
	if ( !req.session.userID ) {

		return res.status(400).send({
			code:    'not-logged-in',
			message: 'You must be logged in to create a new game.'
		});

	}

	const gameOwnerID = req.session.userID;

	// Generate unique game code.
	let gameCode,
	    gameCodeIsUnique = false;

	while ( !gameCodeIsUnique ) {

		gameCode = generateGameCode();

		try {

			gameExists = await database.gameExists( connection, gameCode );
	
		} catch (error) {
	
			return res.status(500).send({
				code:    'database-error',
				message: 'A database error occurred.',
				data:    error
			});
	
		}

		if ( !gameExists ) gameCodeIsUnique = true;
	
	}

	// Create game.
	let gameID;

	try {

		gameID = await database.createGame( connection, {
			name:    gameName,
			code:    gameCode,
			status:  gameStatus,
			content: JSON.stringify( gameContent ),
			owner:   gameOwnerID,
		});

	} catch (error) {

		return res.status(500).send({
			code:    'database-error',
			message: 'A database error occurred.',
			data:    error
		});

	}

	// Create relationship between game and player.
	try {

		await database.createPlayer( connection, {
			game_id:    gameID,
			user_id:    gameOwnerID,
		});

	} catch (error) {

		return res.status(500).send({
			code:    'database-error',
			message: 'A database error occurred.',
			data:    error
		});

	}

	// Finish.
	connection.end();

	const game = {
		id:      gameID,
		code:    gameCode,
		name:    gameName,
		status:  gameStatus,
		content: gameContent,
		owner:   gameOwnerID
	}

	return res.status(200).send({
		game: game
	});

};

const generateGameCode = function() {

	let code = '';

	const length     = 6,
	      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	for ( var i = 0; i < length; i++ ) {
		code += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return code;
	
}
