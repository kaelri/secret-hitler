const mysql = require('mysql');

exports.getConnection = function() {

	return mysql.createConnection({
		host:     process.env.DB_HOST,
		user:     process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});

}

exports.createUser = function( connection, data ) {

	return new Promise((resolve, reject) => {

		connection.query(`INSERT INTO users SET ?`, data, function (error, results, fields) {

			if (error) return reject(error);

			let id = results.insertId;

			return resolve( id );

		});

	});

}

exports.getUserBy = function( key, value, connection ) {

	return new Promise((resolve, reject) => {

		// Only accept unique keys: "id" or "name".
		if ( [ 'id', 'name' ].indexOf(key) == -1 ) {
			reject( new Error('invalid-key') );
		}

		connection.query(`SELECT * FROM users WHERE ${key} = ?`, value, function (error, results, fields) {

			if (error) return reject(error);

			if ( !results.length ) return resolve(false);

			let data = results[0];

			return resolve( data );

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
