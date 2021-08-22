const mysql = require('mysql');

exports.getConnection = function() {

	return mysql.createConnection({
		host:     process.env.DB_HOST,
		user:     process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});

}

exports.createUser = function( connection, userData ) {

	return new Promise((resolve, reject) => {

		connection.query(`INSERT INTO users SET ?`, userData, function (error, results, fields) {

			if (error) return reject(error);

			userId = results.insertId;

			return resolve( userId );

		});

	});

}

exports.getUserByID = function( connection, userID ) {

	return new Promise((resolve, reject) => {

		connection.query(`SELECT * FROM users WHERE id = ?`, userID, function (error, results, fields) {

			if (error) return reject(error);

			if ( !results.length ) return resolve(false);
			
			return resolve( results[0] );

		});

	});

}

exports.getUserByName = function( connection, userName ) {

	return new Promise((resolve, reject) => {

		connection.query(`SELECT * FROM users WHERE name = ?`, userName, function (error, results, fields) {

			if (error) return reject(error);

			if ( !results.length ) return resolve(false);
			
			return resolve( results[0] );

		});

	});

}

exports.userExists = function( connection, userName ) {

	return new Promise((resolve, reject) => {

		connection.query(`SELECT COUNT(id) AS numExistingAccounts FROM users WHERE name = ?`, userName, function (error, results, fields) {

			if (error) return reject(error);

			userExists = ( results[0].numExistingAccounts > 0 );

			return resolve( userExists );

		});

	});

}

exports.gameExists = function( connection, gameCode ) {

	return new Promise((resolve, reject) => {

		connection.query(`SELECT COUNT(id) AS numExistingGames FROM games WHERE code = ?`, gameCode, function (error, results, fields) {

			if (error) return reject(error);

			gameExists = ( results[0].numExistingAccounts > 0 );

			return resolve( gameExists );

		});

	});

}

exports.createGame = function( connection, gameData ) {

	return new Promise((resolve, reject) => {

		connection.query(`INSERT INTO games SET ?`, gameData, function (error, results, fields) {

			if (error) return reject(error);

			gameID = results.insertId;

			return resolve( gameID );

		});

	});

}

exports.createPlayer = function( connection, playerData ) {

	return new Promise((resolve, reject) => {

		connection.query(`INSERT INTO players SET ?`, playerData, function (error, results, fields) {

			if (error) return reject(error);

			playerID = results.insertId;

			return resolve( playerID );

		});

	});

}
