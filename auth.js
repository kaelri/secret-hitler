const express = require('express');
const session = require('express-session');
const mysql   = require('mysql');
const crypto  = require('crypto');

exports.session = async function (req, res, next) {

	res.status(200).send({
		loggedIn: req.session.loggedIn ?? false,
		user:     req.session.user     ?? null
	});

}

exports.register = async function(req, res, next) {

	const userName    = String( req.body.name     ).trim(),
	      userEmail   = String( req.body.email    ).trim(),
	      userDisplay = String( req.body.display  ).trim(),
	      password    = String( req.body.password ).trim(),
	      userRoles   = [ 'player' ],
		  connection  = dbConnection();

	let userId    = null,
	    userHash  = null,
	    userSalt  = null;
	    
	// Check if user exists.
	let userExists;

	try {

		userExists = await dbGetUserExists( connection, userName );

	} catch (error) {

		return res.status(500).send({
			error: error
		});

	}

	if ( userExists ) {

		return res.status(400).send({
			code: 'user-exists',
			message: `A user is already registered with the name “${userName}”.`
		});

	}

	// Create user.
	userSalt = crypto.randomBytes(16).toString('hex');
	userHash = crypto.pbkdf2Sync( password, userSalt, 1000, 64, `sha512`).toString(`hex`);

	try {

		userId = await dbCreateUser( connection, {
			name:    userName,
			hash:    userHash,
			salt:    userSalt,
			email:   userEmail,
			display: userDisplay,
			roles:   userRoles.join(','),
		});

	} catch (error) {

		return res.status(500).send({
			error: error
		});

	}

	// Finish.
	connection.end();

	const user = {
		id:      userId,
		name:    userName,
		email:   userEmail,
		display: userDisplay,
		roles:   userRoles
	}

	req.session.loggedIn = true;
	req.session.user     = user;

	return res.status(200).send({
		loggedIn: true,
		user:     user
	});

};

exports.login = async function(req, res, next) {

	const userName   = req.body.name,
	      password   = req.body.password,
		  connection = dbConnection();

	// Check if user exists.
	let userRows;

	try {

		userRows = await dbGetUser( connection, userName );

	} catch (error) {

		return res.status(500).send({
			error: error
		});

	}

	if ( !userRows.length ) {

		return res.status(400).send({
			code: 'bad-credentials',
			message: `The username or password is incorrect.`
		});

	}

	let userRow = userRows[0];

	// Validate password.
	let loginHash = crypto.pbkdf2Sync(password, userRow.salt, 1000, 64, `sha512`).toString(`hex`);
	
	if ( loginHash != userRow.hash ) {

		return res.status(400).send({
			code: 'bad-credentials',
			message: `The username or password is incorrect.`
		});

	}

	let user = {
		id:      userRow.id,
		name:    userRow.name,
		email:   userRow.email,
		display: userRow.display,
		roles:   userRow.roles.split(',')
	}

	req.session.loggedIn = true;
	req.session.user     = user;

	return res.status(200).send({
		loggedIn: true,
		user:     user
	});

};

exports.logout = async function (req, res, next) {

	req.session.destroy(function(){
		res.status(200).send({
			loggedIn: false,
			user:     null
		});
	});

}

const dbConnection = function() {

	return mysql.createConnection({
		host     : process.env.DB_HOST,
		user     : process.env.DB_USER,
		password : process.env.DB_PASS,
		database : process.env.DB_NAME
	});

}

const dbCreateUser = function( connection, userData ) {

	return new Promise((resolve, reject) => {

		connection.query(`INSERT INTO users SET ?`, userData, function (error, results, fields) {

			if (error) return reject(error);

			userId = results.insertId;

			return resolve( userId );

		});

	});

}

const dbGetUser = function( connection, userName ) {

	return new Promise((resolve, reject) => {

		console.log(userName);

		connection.query(`SELECT * FROM users WHERE name = ?`, userName, function (error, results, fields) {

			if (error) return reject(error);

			return resolve( results );

		});

	});

}

const dbGetUserExists = function( connection, userName ) {

	return new Promise((resolve, reject) => {

		connection.query(`SELECT COUNT(id) AS numExistingAccounts FROM users WHERE name = ?`, userName, function (error, results, fields) {

			if (error) return reject(error);

			userExists = ( results[0].numExistingAccounts > 0 );

			return resolve( userExists );

		});

	});

}
