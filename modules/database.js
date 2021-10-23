const mysql = require('mysql');
const dayjs = require('dayjs');

module.exports = class Database {

	// static connection;

	static getConnection( options = {} ) {

		if ( !this.connection ) {

			options = Object.assign({
				host:     process.env.DB_HOST,
				user:     process.env.DB_USER,
				password: process.env.DB_PASS,
				database: process.env.DB_NAME,
			}, options );

			this.connection = mysql.createConnection(options);

		}

		return this.connection;

	}

	// INSTALL & UNINSTALL

	static async install() {

		return new Promise((resolve, reject) => {

			const connection = this.getConnection({ multipleStatements: true });

			let sql = `CREATE TABLE \`users\` (
				\`id\` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
				\`name\` varchar(60) NOT NULL DEFAULT '',
				\`hash\` varchar(255) NOT NULL DEFAULT '',
				\`salt\` varchar(255) NOT NULL DEFAULT '',
				\`display\` varchar(100) NOT NULL DEFAULT '',
				\`email\` varchar(100) NOT NULL DEFAULT '',
				\`roles\` varchar(100) NOT NULL DEFAULT '',
				\`created\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY (id)
			);
			
			CREATE TABLE \`games\` (
				\`id\` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
				\`code\` varchar(60) NOT NULL DEFAULT '',
				\`name\` varchar(60) NOT NULL DEFAULT '',
				\`status\` varchar(60) NOT NULL DEFAULT '',
				\`content\` longtext NOT NULL DEFAULT '',
				\`created\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
				\`modified\` datetime NOT NULL,
				PRIMARY KEY (id)
			);
			
			CREATE TABLE \`players\` (
				\`id\` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
				\`game_id\` bigint(20) UNSIGNED NOT NULL,
				\`user_id\` bigint(20) UNSIGNED NOT NULL,
				PRIMARY KEY (id)
			);`;

			connection.query(sql, function (error, results, fields) {

				connection.end();

				if (error) return reject(error);

				console.info(`“${process.env.DB_NAME}” database installed!`);

				return resolve();

			});
			
		});

	}

	static async uninstall() {

		return new Promise((resolve, reject) => {

			const connection = this.getConnection({ multipleStatements: true });

			const sql = 'DROP TABLE IF EXISTS `users`,`games`,`players`,`sessions`;';
	
			connection.query(sql, function (error, results, fields) {

				connection.end();

				if (error) return reject(error);

				console.info(`“${process.env.DB_NAME}” database uninstalled.`);

				return resolve();

			});
			
		});

	}

	// USERS

	static createUser( data ) {

		return new Promise((resolve, reject) => {

			const connection = this.getConnection();

			const values = {
				name:    String( data.name ),
				email:   String( data.email ),
				display: String( data.display ),
				roles:   data.roles.join(','),
				salt:    String( data.salt ),
				hash:    String( data.hash ),
			}

			connection.query(`INSERT INTO users SET ?`, values, function (error, results, fields) {

				if (error) return reject(error);

				let id = results.insertId;

				return resolve( id );

			});

		});

	}

	static getUserBy( key, data ) {

		return new Promise((resolve, reject) => {

			const connection = this.getConnection();

			// Only accept unique keys: "id" or "name".
			let value;

			switch ( key ) {
				case 'id':
					value = parseInt(data);
					break;
				case 'name':
					value = String( data );
					break;
				default:
					return reject( new Error('invalid-key') );
			}

			connection.query(`SELECT * FROM users WHERE ${key} = ?`, value, function (error, results, fields) {

				if (error) return reject(error);

				if ( !results.length ) return resolve(false);

				const row = results[0];

				const data = {
					id:      row.id,
					name:    row.name,
					email:   row.email,
					display: row.display,
					roles:   row.roles.split(','),
					salt:    row.salt,
					hash:    row.hash,
					created: dayjs(row.created),
				}

				return resolve( data );

			});

		});

	}

	static userExists( name ) {

		return new Promise((resolve, reject) => {

			const connection = this.getConnection();

			connection.query(`SELECT COUNT(id) AS numExistingUsers FROM users WHERE name = ?`, name, function (error, results, fields) {

				if (error) return reject(error);

				let userExists = ( results[0].numExistingUsers > 0 );

				return resolve( userExists );

			});

		});

	}

	// GAMES

	static createGame( data ) {

		return new Promise((resolve, reject) => {

			const connection = this.getConnection();

			const values = {
				name:    String( data.name ),
				code:    String( data.code ),
				status:  String( data.status ),
				content: JSON.stringify( data.content ),
				modified: data.modified.toDate(),
			}

			connection.query(`INSERT INTO games SET ?`, values, function (error, results, fields) {

				if (error) return reject(error);

				let id = results.insertId;

				return resolve( id );

			});

		});

	}

	static saveGame( id, data ) {

		return new Promise((resolve, reject) => {

			const connection = this.getConnection();

			const values = {
				name:     String( data.name ),
				status:   String( data.status ),
				content:  JSON.stringify( data.content ),
				modified: data.modified.toDate(),
			}

			connection.query(`UPDATE games SET ? WHERE id = ?`, [ values, id ], function (error, results, fields) {

				if (error) return reject(error);

				return resolve(true);

			});

		});

	}

	static createPlayer( data ) {

		console.log(data);

		return new Promise((resolve, reject) => {

			const connection = this.getConnection();

			const values = {
				game_id: parseInt( data.gameID ),
				user_id: parseInt( data.userID ),
			}

			connection.query(`INSERT INTO players SET ?`, values, function (error, results, fields) {

				if (error) return reject(error);

				let id = results.insertId;

				return resolve( id );

			});

		});

	}

	static getGameBy( key, data ) {

		return new Promise((resolve, reject) => {

			// Only accept unique keys: "id" or "code".
			let value;

			switch ( key ) {
				case 'id':
					value = parseInt(data);
					break;
				case 'code':
					value = String( data );
					break;
				default:
					return reject( new Error('invalid-key') );
			}

			const connection = this.getConnection();

			connection.query(`SELECT * FROM games WHERE ${key} = ?`, value, function (error, results, fields) {

				if (error) return reject(error);

				if ( !results.length ) return resolve(false);

				const row = results[0];

				const data = {
					id:       row.id,
					code:     row.code,
					name:     row.name,
					status:   row.status,
					content:  JSON.parse( row.content ),
					created:  dayjs(row.created),
					modified: dayjs(row.modified),
				}

				return resolve( data );

			});

		});

	}

	static getGameIDsByUser( userID ) {

		return new Promise((resolve, reject) => {

			const connection = this.getConnection();

			connection.query(`SELECT * FROM players WHERE user_id = ?`, userID, function (error, results, fields) {

				if (error) return reject(error);

				let gameIDs = [];

				for (let i = 0; i < results.length; i++) {
					const player = results[i];

					gameIDs.push( player.game_id );
					
				}

				return resolve( gameIDs );

			});

		});

	}

	static gameExists( code ) {

		return new Promise((resolve, reject) => {

			const connection = this.getConnection();

			connection.query(`SELECT COUNT(id) AS numExistingGames FROM games WHERE code = ?`, code, function (error, results, fields) {

				if (error) return reject(error);

				let gameExists = ( results[0].numExistingGames > 0 );

				return resolve( gameExists );

			});

		});

	}

}
