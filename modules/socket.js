const { Server } = require('socket.io');

module.exports = class Socket {

	// static io;

	static setup( server, session ) {
		
		this.io = new Server( server, {
			cors: {
				origin:  '*',
				methods: ['GET', 'POST']
			}
		});

		this.io.use(function(socket, next) {
			 session(socket.request, {}, next);
		 });

		this.io.on('connection', (socket) => {

			const session = socket.request.session;

			if ( !session.userID ) return;

			const userID = session.userID;

			console.log( `User ${userID} has logged in.` );

			// Join a "room" with the user’s ID to make it easier to target this socket.
			socket.join(`user${userID}`);
			
			socket.on('disconnect', () => {
				console.log( `User ${userID} has logged out.` );
			});

		});

	}

}
