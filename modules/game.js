const Database = require('./database');
const Socket   = require('./socket');
const User     = require('./user');

module.exports = class Game {

	constructor( data ) {
		this.id       = data.id;
		this.code     = data.code;
		this.name     = data.name;
		this.status   = data.status;
		this.content  = data.content;
		this.created  = data.created;
		this.modified = data.modified;
	}

	async save() {

		await Database.saveGame( this.id, {
			name:    this.name,
			status:  this.status,
			content: this.content,
		});

		Socket.io.to(`game-${this.id}`).emit( 'gameUpdated', this.export() );

	}

	async addPlayer( user, roles = [] ) {

		this.content.players.push = ({
			name:    user.name,
			display: user.display,
			roles:   roles,
		});

		await Database.createPlayer({
			gameID: this.id,
			userID: user.id,
		});

	}

	export() {

		const data = {
			code:     this.code,
			name:     this.name,
			status:   this.status,
			content:  this.content,
			created:  this.created,
			modified: this.modified,
		}

		return data;

	}

	static async create( input ) {

		const name   = input.name,
		      user   = input.user,
		      code   = await this.generateCode(),
		      status = 'new';

		const content = {
			players: [],
		}

		// Create game.
		const id = await Database.createGame({
			name:    name,
			code:    code,
			status:  status,
			content: content,
		});
	
		const data = await Database.getGameBy( 'id', id ),
			  game = new this(data);
		
		// Add the current user as the first player and host.
		await game.addPlayer( user, [ 'host' ] );
		await game.save();
	
		// Finish.
		return game;
	
	};

	static async get( key, value ) {
	
		let data = await Database.getGameBy( key, value );
	
		if ( !data ) return null;
	
		const game = new this(data);
	
		return game;
	
	}
	
	static async generateCode() {
	
		let code,
		    codeIsUnique = false;
	
		const length     = 6,
			  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	
		while ( !codeIsUnique ) {
	
			code = '';
	
			for ( var i = 0; i < length; i++ ) {
				code += characters.charAt(Math.floor(Math.random() * characters.length));
			}
		
			let gameExists = await Database.gameExists( code );
		
			if ( !gameExists ) {
				codeIsUnique = true;
				break;
			}
		
		}
	
		return code;
		
	}
	
}
