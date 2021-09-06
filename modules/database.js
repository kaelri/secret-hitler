const mysql = require('mysql');

module.exports = class Database {

	// CONNECTION

	static getConnection() {

		return mysql.createConnection({
			host:     process.env.DB_HOST,
			user:     process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});

	}

	// USERS

	static createUser( data ) {

		const connection = this.getConnection();

		return new Promise((resolve, reject) => {

			connection.query(`INSERT INTO users SET ?`, data, function (error, results, fields) {

				connection.end();

				if (error) return reject(error);

				let id = results.insertId;

				return resolve( id );

			});

		});

	}

	static getUserBy( key, value ) {

		const connection = this.getConnection();

		return new Promise((resolve, reject) => {

			// Only accept unique keys: "id" or "name".
			if ( [ 'id', 'name' ].indexOf(key) == -1 ) {
				reject( new Error('invalid-key') );
			}

			connection.query(`SELECT * FROM users WHERE ${key} = ?`, value, function (error, results, fields) {

				connection.end();

				if (error) return reject(error);

				if ( !results.length ) return resolve(false);

				let data = results[0];

				return resolve( data );

			});

		});

	}

	static userExists( name ) {

		const connection = this.getConnection();

		return new Promise((resolve, reject) => {

			connection.query(`SELECT COUNT(id) AS numExistingUsers FROM users WHERE name = ?`, name, function (error, results, fields) {

				connection.end();

				if (error) return reject(error);

				let userExists = ( results[0].numExistingUsers > 0 );

				return resolve( userExists );

			});

		});

	}

	// GAMES

	static createGame( data ) {

		const connection = this.getConnection();

		return new Promise((resolve, reject) => {

			connection.query(`INSERT INTO games SET ?`, data, function (error, results, fields) {

				connection.end();

				if (error) return reject(error);

				let id = results.insertId;

				return resolve( id );

			});

		});

	}

	static createPlayer( data ) {

		const connection = this.getConnection();

		return new Promise((resolve, reject) => {

			connection.query(`INSERT INTO players SET ?`, data, function (error, results, fields) {

				connection.end();

				if (error) return reject(error);

				let id = results.insertId;

				return resolve( id );

			});

		});

	}

	static getGameBy( key, value ) {

		const connection = this.getConnection();

		return new Promise((resolve, reject) => {

			// Only accept unique keys: "id" or "name".
			if ( [ 'id', 'code' ].indexOf(key) == -1 ) {
				reject( new Error('invalid-key') );
			}

			connection.query(`SELECT * FROM games WHERE ${key} = ?`, value, function (error, results, fields) {

				connection.end();

				if (error) return reject(error);

				if ( !results.length ) return resolve(false);

				let data = results[0];

				return resolve( data );

			});

		});

	}

	static gameExists( code ) {

		const connection = this.getConnection();

		return new Promise((resolve, reject) => {

			connection.query(`SELECT COUNT(id) AS numExistingGames FROM games WHERE code = ?`, code, function (error, results, fields) {

				connection.end();

				if (error) return reject(error);

				let gameExists = ( results[0].numExistingGames > 0 );

				return resolve( gameExists );

			});

		});

	}

}
