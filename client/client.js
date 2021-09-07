new Vue({

	name: 'secret-hitler',

	el: '#secret-hitler',

	data: {

		user:      null,
		game:      null,
		socket:    null,
		socketURL: null,
		view:      null,

		// LOGIN
		loginName:     '',
		loginPassword: '',

	},

	computed: {

		loggedIn() {
			return ( this.user !== null );
		}

	},

	/*html*/
	template: `<article id="secret-hitler">

		<header>

			<h2>User</h2>

			<p v-if="!loggedIn"><a href @click.prevent="setView('login')">Log in</a> • <a href @click.prevent="setView('register')">Register</a></p>
			<p v-if="loggedIn"><span :title="user.name">{{ user.display }}</span> • <a href @click.prevent="logout">Log out</a></p>

		</header>

		<sh-home
			v-show="isView('home')"
			@setView="setView"
		></sh-home>

		<sh-create
			v-show="isView('create')"
			@setView="setView"
			@setGame="setGame"
		></sh-create>

		<sh-register
			v-show="isView('register')"
			@setView="setView"
			@setUser="setUser"
		></sh-register>

		<sh-login
			v-show="isView('login')"
			@setView="setView"
			@setUser="setUser"
		></sh-login>

	</article>`,

	mounted() {

		this.getData();

	},

	methods: {

		isView( viewID ) {
			return this.view == viewID;
		},

		setView( viewID ) {
			this.view = viewID;
		},

		openSocket() {

			if ( this.socket ) this.socket.disconnect();

			this.socket = io( this.socketURL );

			this.socket.on('dev-message', (message) => console.log( `[Dev Message] ${message}` ) );

		},

		closeSocket() {

			if ( this.socket ) {
				this.socket.disconnect();
				this.socket = null;
			}

		},

		setUser( user ) {

			this.user = user;

			if ( user ) this.openSocket();

		},

		setGame( game ) {
			this.game = game;
		},

		getData() {

			let self = this;

			new Portal({
				endpoint: '/rest/client/get',
				body: {},
				callback( call ) {

					switch ( call.status ) {
						case 200:

							self.socketURL = call.response.socketURL;

							if ( call.response.loggedIn ) {
								self.setUser( call.response.user );
								self.setView('home');
							} else {
								self.setView('login');
							}

							break;

						default:
							console.error( 'Something went wrong.', call );
							break;
					}

				},
			});

		},

		logout() {

			let self = this;

			new Portal({
				endpoint: '/rest/user/logout',
				body: {},
				callback( call ) {
					
					switch ( call.status ) {
						case 200:
							self.user = null;
							self.closeSocket();
							self.setView('login');
							break;
						case 400:
							console.info(call.response.code);
							break;
						default:
							console.error( 'Something went wrong.', call );
					}

				},
			});

		},

	},

});
