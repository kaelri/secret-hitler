const crypto   = require('crypto');
const Database = require('./database');

module.exports = class User {

	// Construct from database row.
	constructor( data ) {
		this.id      = data.id;
		this.name    = data.name;
		this.email   = data.email;
		this.display = data.display;
		this.roles   = data.roles.split(',');
		this.salt    = data.salt;
		this.hash    = data.hash;
		this.created = data.created;
	}

	validatePassword( password ) {

		let passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
		
		let passwordValid = ( passwordHash === this.hash );

		return passwordValid;

	}

	export() {
		return {
			id:      this.id,
			name:    this.name,
			email:   this.email,
			display: this.display,
		}
	}

	static async create( input ) {

		const salt = crypto.randomBytes(16).toString('hex'),
			  hash = crypto.pbkdf2Sync( input.password, salt, 1000, 64, `sha512`).toString(`hex`);
	
		const id = await Database.createUser({
			name:    input.name,
			email:   input.email,
			display: input.display,
			roles:   input.roles.join(','),
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

		const id = req.session.userID || null;

		if ( !id ) return null;

		let user = await this.get( 'id', id );
		
		return user;

	}
	
}
