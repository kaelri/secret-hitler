const express = require('express');
const session = require('express-session');
const mysql   = require('mysql');
const dayjs   = require('dayjs');

class shGame {
	
}

exports.create = async function(req, res, next) {

	const gameName   = String( req.body.name ?? '' ).trim(),
	      gameState  = {},
		  connection = dbConnection();

	// Check auth.
	if ( !req.session.loggedIn ) {

		return res.status(400).send({
			code:    'not-logged-in',
			message: 'You must be logged in to create a new game.'
		});

	}

	const gameOwnerID = req.session.user.id;

	// Generate unique game code.
	let gameCode,
	    gameCodeIsUnique = false;

	while ( !gameCodeIsUnique ) {

		gameCode = generateGameCode();

		try {

			gameExists = await dbGetGameExists( connection, gameCode );
	
		} catch (error) {
	
			return res.status(500).send({
				code:    'unknown',
				message: 'An unknown error occurred.',
				data:    error
			});
	
		}

		if ( !gameExists ) gameCodeIsUnique = true;
	
	}

	// Create game.
	let gameID;

	try {

		gameID = await dbCreateGame( connection, {
			name:    gameName,
			code:    gameCode,
			state:   JSON.stringify( gameState ),
			owner:   gameOwnerID,
		});

	} catch (error) {

		return res.status(500).send({
			code:    'unknown',
			message: 'An unknown error occurred.',
			data:    error
		});

	}

	// Create relationship between game and player.
	try {

		await dbCreatePlayer( connection, {
			game_id:    gameID,
			user_id:    gameOwnerID,
		});

	} catch (error) {

		return res.status(500).send({
			code:    'unknown',
			message: 'An unknown error occurred.',
			data:    error
		});

	}

	// Finish.
	connection.end();

	const game = {
		id:      gameID,
		code:    gameCode,
		name:    gameName,
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

const dbConnection = function() {

	return mysql.createConnection({
		host     : process.env.DB_HOST,
		user     : process.env.DB_USER,
		password : process.env.DB_PASS,
		database : process.env.DB_NAME
	});

}

const dbGetGameExists = function( connection, gameCode ) {

	return new Promise((resolve, reject) => {

		connection.query(`SELECT COUNT(id) AS numExistingGames FROM games WHERE code = ?`, gameCode, function (error, results, fields) {

			if (error) return reject(error);

			gameExists = ( results[0].numExistingAccounts > 0 );

			return resolve( gameExists );

		});

	});

}

const dbCreateGame = function( connection, gameData ) {

	return new Promise((resolve, reject) => {

		connection.query(`INSERT INTO games SET ?`, gameData, function (error, results, fields) {

			if (error) return reject(error);

			gameID = results.insertId;

			return resolve( gameID );

		});

	});

}

const dbCreatePlayer = function( connection, playerData ) {

	return new Promise((resolve, reject) => {

		connection.query(`INSERT INTO players SET ?`, playerData, function (error, results, fields) {

			if (error) return reject(error);

			playerID = results.insertId;

			return resolve( playerID );

		});

	});

}
