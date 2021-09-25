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

			if ( !session.userName ) return;

			const userName = session.userName;

			console.info( `User ${userName} has logged in.` );

			// Join a "room" with the user’s ID to make it easier to target this socket.
			socket.join(`user-${userName}`);

			socket.on('enterGame', ( gameCode ) => {
				console.info( `User ${userName} has joined game ${gameCode}.` );
				socket.join(`game-${gameCode}`);
			});
			
			socket.on('leaveGame', ( gameCode ) => {
				console.info( `User ${userName} has left game ${gameCode}.` );
				socket.leave(`game-${gameCode}`);
			});
			
			socket.on('disconnect', () => {
				console.info( `User ${userName} has logged out.` );
			});

		});

	}

}
