const express = require('express');
const session = require('express-session');
const mysql   = require('mysql');
const crypto  = require('crypto');

exports.register = function(req, res, next) {

	let username = req.body.username,
	    password = req.body.password,
	    email    = req.body.email;

	var connection = mysql.createConnection({
		host     : process.env.DB_HOST,
		user     : process.env.DB_USER,
		password : process.env.DB_PASS,
		database : process.env.DB_NAME
	});

	// Check if user exists.
	let numExistingAccounts;

	try {

		connection.query(`SELECT COUNT(id) AS numExistingAccounts FROM users WHERE username = ?`, email, function (error, results, fields) {

			if (error) throw error;

			numExistingAccounts = results[0].numExistingAccounts;

		});

	} catch (error) {

		res.status(500).send(error);
		return;

	}

	if ( numExistingAccounts > 0 ) {
		res.status(400).send({
			code: 'user-exists',
			message: 'A user is already registered with this name.'
		});
		return;
	}

	// Create user.
	let salt = crypto.randomBytes(16).toString('hex'),
	    hash;

	try {

		connection.query(`INSERT INTO users SET ?`, {
			username: username,
			hash:     hash,
			salt:     salt,
			email:    email,
			roles:    'player',
		}, function (error, results, fields) {

			if (error) throw error;

			numExistingAccounts = results[0].numExistingAccounts;

		});

	} catch (error) {

		res.status(500).send(error);
		return;

	}


	// Finish.
	connection.end();

	res.status(200).send({ user: 'So far, so good.' });

};

exports.login = function(req, res, next) {

	res.status(200).send({
		gotUsername: req.body.username,
		gotPassword: req.body.password
	})

};
