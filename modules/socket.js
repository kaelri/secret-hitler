const { Server } = require('socket.io');

module.exports = class Socket {

	// static io;

	static init( httpServer ) {
		
		this.io = new Server( httpServer );
	
		this.io.on('connection', (socket) => {

			console.log('a user connected');

			socket.on('disconnect', () => {
				console.log('user disconnected');
			});

		});

	}

}
