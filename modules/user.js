const crypto   = require('crypto');
const Database = require('./database');
const Game     = require('./game');

module.exports = class User {

	// Construct from database row.
	constructor( data ) {
		this.id      = data.id;
		this.name    = data.name;
		this.email   = data.email;
		this.display = data.display;
		this.roles   = data.roles;
		this.salt    = data.salt;
		this.hash    = data.hash;
		this.created = data.created;
		this.games   = {};
	}

	validatePassword( password ) {

		let passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
		
		let passwordValid = ( passwordHash === this.hash );

		return passwordValid;

	}

	async fetchGames() {

		const games = {}

		const gameIDs = await Database.getGameIDsByUser( this.id );

		for (let i = 0; i < gameIDs.length; i++) {
			const gameID = gameIDs[i];

			const data = await Database.getGameBy( 'id', gameID );

			const game = new Game(data);

			games[ game.code ] = {
				code:     game.code,
				name:     game.name,
				status:   game.status,
				modified: game.modified,
			};
			
		}

		this.games = games;

		return games;

	}

	export() {

		const data = {
			id:      this.id,
			name:    this.name,
			email:   this.email,
			display: this.display,
			created: this.created.format(),
			games:   this.games,
		}

		return data;

	}

	static async create( input ) {

		const name    = input.name,
		      email   = input.email,
		      display = input.display,
		      roles   = input.roles,
		      salt    = crypto.randomBytes(16).toString('hex'),
			  hash    = crypto.pbkdf2Sync( input.password, salt, 1000, 64, `sha512`).toString(`hex`);
	
		const id = await Database.createUser({
			name:    name,
			email:   email,
			display: display,
			roles:   roles,
			salt:    salt,
			hash:    hash,
		});
	
		const data = await Database.getUserBy( 'id', id ),
			  user = new this(data);
	
		return user;
	
	}
	
	static async get( key, value ) {
	
		let data = await Database.getUserBy( key, value );
	
		if ( !data ) return null;
	
		const user = new this(data);
	
		return user;
	
	}
	
	static async exists( name ) {
	
		let exists = await Database.userExists( name );
	
		return exists;
	
	}

	static async getCurrent( req ) {

		const name = req.session.userName || null;

		if ( !name ) return null;

		let user = await this.get( 'name', name );
		
		return user;

	}
	
}
