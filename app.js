const dotenv       = require('dotenv').config();
const fs           = require('fs');
const createError  = require('http-errors');
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const session      = require('express-session');
const mysqlStore   = require('express-mysql-session')(session);
const router       = require('./routes/index');
const Database     = require('./modules/database');

// APP
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));

if ( process.env.APP_LOG && process.env.APP_LOG !== 'false') {

	app.use(logger('common', {
		stream: fs.createWriteStream(process.env.APP_LOG, {flags: 'a'})
	}));

}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
app.use(session({
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
}));

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

// On Dreamhost, the Passenger framework starts app.js directly instead of starting from ./bin/www.
if ( process.env.APP_SERVER && process.env.APP_SERVER === 'passenger') {
    app.listen(3000);
}

module.exports = app;
