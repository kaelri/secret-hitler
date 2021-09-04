const mysql = require('mysql');

module.exports = class Database {

	// CONNECTION

	static connection;

	static getConnection() {

		if ( !this.connection ) {

			this.connection = mysql.createConnection({
				host:     process.env.DB_HOST,
				user:     process.env.DB_USER,
				password: process.env.DB_PASS,
				database: process.env.DB_NAME
			});

		}

		return this.connection;

	}

	static closeConnection() {

		if ( this.connection ) {
			this.connection.end();
			this.connection = null;
		}

	}

	// USERS

	static createUser = function( data, connection ) {

		return new Promise((resolve, reject) => {

			connection.query(`INSERT INTO users SET ?`, data, function (error, results, fields) {

				if (error) return reject(error);

				let id = results.insertId;

				return resolve( id );

			});

		});

	}

	static getUserBy = function( key, value, connection ) {

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

	static userExists = function( name, connection ) {

		return new Promise((resolve, reject) => {

			connection.query(`SELECT COUNT(id) AS numExistingAccounts FROM users WHERE name = ?`, name, function (error, results, fields) {

				if (error) return reject(error);

				userExists = ( results[0].numExistingAccounts > 0 );

				return resolve( userExists );

			});

		});

	}

	// GAMES

	static createGame = function( data, connection ) {

		return new Promise((resolve, reject) => {

			connection.query(`INSERT INTO games SET ?`, data, function (error, results, fields) {

				if (error) return reject(error);

				id = results.insertId;

				return resolve( id );

			});

		});

	}

	static createPlayer = function( data, connection ) {

		return new Promise((resolve, reject) => {

			connection.query(`INSERT INTO players SET ?`, data, function (error, results, fields) {

				if (error) return reject(error);

				id = results.insertId;

				return resolve( id );

			});

		});

	}

	static getGameBy = function( key, value, connection ) {

		return new Promise((resolve, reject) => {

			// Only accept unique keys: "id" or "name".
			if ( [ 'id', 'code' ].indexOf(key) == -1 ) {
				reject( new Error('invalid-key') );
			}

			connection.query(`SELECT * FROM games WHERE ${key} = ?`, value, function (error, results, fields) {

				if (error) return reject(error);

				if ( !results.length ) return resolve(false);

				let data = results[0];

				return resolve( data );

			});

		});

	}

	static gameExists = function( connection, code ) {

		return new Promise((resolve, reject) => {

			connection.query(`SELECT COUNT(id) AS numExistingGames FROM games WHERE code = ?`, code, function (error, results, fields) {

				if (error) return reject(error);

				gameExists = ( results[0].numExistingAccounts > 0 );

				return resolve( gameExists );

			});

		});

	}

}
