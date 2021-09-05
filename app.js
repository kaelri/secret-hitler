const dotenv         = require('dotenv').config();
const fs             = require('fs');
const createError    = require('http-errors');
const debug          = require('debug')('sh:server');
const http           = require('http');
const https          = require('https');
const express        = require('express');
const expressSession = require('express-session');
const mysqlStore     = require('express-mysql-session')(expressSession);
const path           = require('path');
const cookieParser   = require('cookie-parser');
const logger         = require('morgan');
const router         = require('./routes/routes');
const cors           = require('cors');
const Database       = require('./modules/database');
const Socket         = require('./modules/socket');

// APP
const app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Logging
app.use(logger('dev'));

if ( process.env.APP_LOG && process.env.APP_LOG !== 'false') {
	app.use(logger('common', {
		stream: fs.createWriteStream(process.env.APP_LOG, {flags: 'a'})
	}));
}

// CORS
app.use(cors());
app.options('*', cors());

// Express features
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
const session = expressSession({
	key:               'secret_hitler_session',
	resave:            false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret:            process.env.APP_SESSION_SECRET,
	store:             new mysqlStore({
		host:     process.env.DB_HOST || 'localhost',
		port:     process.env.DB_PORT || 3306,
		user:     process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
	}),
	cookie: {
		sameSite: true
	}
});

app.use( session );

// Open and close database connection.
app.use(function (req, res, next) {

    function afterResponse() {

        res.removeListener( 'finish', afterResponse );
        res.removeListener( 'close',  afterResponse );

        Database.closeConnection();

    }

    res.on( 'finish', afterResponse );
    res.on( 'close',  afterResponse );

    Database.openConnection();
    next();

});

// Define routes.
app.use( '/', router );

// Catch 404 and forward to error handler.
app.use(function(req, res, next) {

	next(createError(404));
	
});

// Error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// Start HTTP(S) server.
let port,
    server,
    usingPassenger = ( typeof(PhusionPassenger) != 'undefined' ),
	usingSSL       = ( process.env.SSL && process.env.SSL === 'true' );

if ( usingPassenger ) {

	PhusionPassenger.configure({ autoInstall: false });

	server = app.listen( 8080 );

} else if ( usingSSL ) {

	port = normalizePort( process.env.SSL_PORT || 443 );
	app.set('port', port );
		
	// HTTPS
	server = https.createServer({
		cert: fs.readFileSync( process.env.SSL_CERTIFICATE, 'utf-8'),
		key:  fs.readFileSync( process.env.SSL_KEY,         'utf-8')
	}, app).listen( port );

} else {

	port = normalizePort( process.env.APP_PORT || 80 );
	app.set('port', port );
		
	server = http.createServer( {}, app ).listen( port );

}

server.on( 'error',     onError     );
server.on( 'listening', onListening );

// Sockets server listens on a separate port.
let socketPort = normalizePort( process.env.WS_PORT || 8080 ),
    socketServer; 

console.log( socketPort, port );

if ( socketPort === port ) {

	socketServer = server;

} else if ( usingSSL ) {

	socketServer = https.createServer({
		cert: fs.readFileSync( process.env.SSL_CERTIFICATE, 'utf-8'),
		key:  fs.readFileSync( process.env.SSL_KEY,         'utf-8')
	}, app).listen( socketPort );

} else {

	socketServer = http.createServer( {}, app ).listen( socketPort );
	
}

Socket.setup( socketServer, session );

// Backup HTTP server redirects to SSH.
if ( usingSSL && !usingPassenger ) {

	// Backup HTTP server redirects to HTTPS.
	const httpApp = express()
	.set('port', 80)
	.get('*', function(req, res) {
		res.redirect( process.env.APP_URL + req.url);
	});
	
	const httpServer = http.createServer( {}, httpApp ).listen( 80 );

}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);
  
	if (isNaN(port)) {
	  // named pipe
	  return val;
	}
  
	if (port >= 0) {
	  // port number
	  return port;
	}
  
	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
		console.error(bind + ' requires elevated privileges');
		process.exit(1);
		break;
		case 'EADDRINUSE':
		console.error(bind + ' is already in use');
		process.exit(1);
		break;
		default:
		throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}  

module.exports = app;
