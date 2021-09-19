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

			console.info( `User ${userID} has logged in.` );

			// Join a "room" with the user’s ID to make it easier to target this socket.
			socket.join(`user-${userID}`);

			socket.on('joinGame', ( gameID ) => {
				console.info( `User ${userID} has joined game-${gameID}.` );
				socket.join(`game-${gameID}`);
			});
			
			socket.on('leaveGame', ( gameID ) => {
				console.info( `User ${userID} has left game-${gameID}.` );
				socket.leave(`game-${gameID}`);
			});
			
			socket.on('disconnect', () => {
				console.info( `User ${userID} has logged out.` );
			});

		});

	}

}
