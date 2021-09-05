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

			// console.log('new socket with session', socket.handshake.session );

			// socket.on('disconnect', () => {});

		});

	}

	static shareSession( session ) {

	}

}
