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

			if ( !socket.handshake.session || !socket.handshake.session.userID ) return;

			const userID = socket.handshake.session.userID;

			console.log(`User ${userID} has connected.`);

			// Join a "room" with the user’s ID to make it easier to target this socket.
			socket.join(`user-${userID}`);

			socket.on('disconnect', () => {
				console.log(`User ${userID} has disconnected.`);
			});

		});

	}

}
