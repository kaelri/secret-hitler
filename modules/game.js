const Database = require('./database');

module.exports = class Game {

	constructor( data ) {
		this.id       = data.id;
		this.code     = data.code;
		this.name     = data.name;
		this.status   = data.status;
		this.content  = data.content;
		this.owner    = data.owner;
		this.created  = data.created;
		this.modified = data.modified;
	}

	static async create( input ) {

		const code    = await this.generateCode(),
		      content = {};

		// Create game.
		const id = await Database.createGame({
			name:    input.name,
			owner:   input.owner,
			code:    code,
			status:  'new',
			content: JSON.stringify( content ),
		});
	
		const data = await Database.getGameBy( 'id', id ),
			  game = new this(data);
	
		// Create relationship between game and player.
		const relationship = await Database.createPlayer({
			game_id: game.id,
			user_id: game.owner,
		});

		// Finish.
		return game;
	
	};

	export( userID = null ) {
		return {
			id:       this.id,
			code:     this.code,
			name:     this.name,
			status:   this.status,
			content:  this.content,
			owner:    this.owner,
			created:  this.created,
			modified: this.modified,
		}
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
