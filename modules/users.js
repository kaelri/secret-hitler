const crypto   = require('crypto');
const database = require('./database');

class User {

	constructor( data = {} ) {
		this.id      = data.id      || 0;
		this.name    = data.name    || '';
		this.email   = data.email   || '';
		this.display = data.display || '';
		this.roles   = data.roles   || [];
		this.salt    = data.salt    || '';
		this.hash    = data.hash    || '';
		this.created = data.created || new Date();
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
			roles:   this.roles
		}
	}

}

exports.User = User;

exports.create = async function( data ) {

	const connection = database.getConnection();

	let salt = crypto.randomBytes(16).toString('hex'),
	    hash = crypto.pbkdf2Sync( data.password, salt, 1000, 64, `sha512`).toString(`hex`);

	let id = await database.createUser( connection, {
		name:    data.name,
		email:   data.email,
		display: data.display,
		roles:   data.roles,
		salt:    salt,
		hash:    hash,
	});

	const user = new User({
		id:      id,
		name:    data.name,
		email:   data.email,
		display: data.display,
		roles:   data.roles,
		salt:    salt,
		hash:    hash,
	});

	connection.end();

	return user;

}

exports.get = async function( key, value ) {

	const connection = database.getConnection();

	let data = await database.getUserBy( key, value, connection );

	if ( !data ) return null;

	const user = new User({
		id:      data.id,
		name:    data.name,
		email:   data.email,
		display: data.display,
		roles:   data.roles,
		hash:    data.hash,
		salt:    data.salt,
		created: data.created,
	});

	connection.end();

	return user;

}

exports.exists = async function( name ) {

	const connection = database.getConnection();

	let exists = await database.userExists( connection, name );

	connection.end();

	return exists;

}
