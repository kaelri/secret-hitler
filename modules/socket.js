const { Server }    = require('socket.io');
const sharedsession = require('express-socket.io-session');

module.exports = class Socket {

	// static io;

	static setup( server, session ) {
		
		this.io = new Server( server );

		this.io.use(sharedsession(session, {
			autoSave:true
		}));

		this.io.on('connection', (socket) => {

			console.log(`User ${socket.handshake.session.userID} has connected.`);

			// Join a "room" with the user’s ID to make it easier to target this socket.
			socket.join(`user-${socket.handshake.session.userID}`);

			socket.on('disconnect', () => {
				console.log(`User ${socket.handshake.session.userID} has disconnected.`);
			});

		});

	}

}
