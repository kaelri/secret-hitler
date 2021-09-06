new Vue({

	name: 'secret-hitler',

	el: '#secret-hitler',

	data: {

		user:      null,
		game:      null,
		socket:    null,
		socketURL: secretHitlerData.socketURL,
		view:      'home',

		// REGISTER
		registerName:     '',
		registerPassword: '',
		registerEmail:    '',
		registerDisplay:  '',

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

		

		<section id="login" v-show="isView('login')">

			<h2>Login</h2>

			<div>
				<label for="login-name">Username</label>
				<input type="text" name="login-name" v-model="loginName">
			</div>

			<div>
				<label for="login-password">Password</label>
				<input type="password" name="password" v-model="loginPassword">
			</div>

			<button type="button" @click.prevent="login">Log in</button>

		</section>

	</article>`,

	mounted() {

		this.getUser();

	},

	methods: {

		isView( viewID ) {
			return this.view == viewID;
		},

		setView( viewID ) {
			this.view = viewID;
		},

		openSocket() {

			if ( this.socket ) return;

			this.socket = io( this.socketURL );

			this.socket.on('dev-message', (message) => console.log( `[Dev Message] ${message}` ) );

		},

		closeSocket() {

			if ( this.socket ) {
				this.socket.disconnect();
				this.socket = null;
			}

		},

		getUser() {

			let self = this;

			new Portal({
				endpoint: '/rest/user/get',
				body: {},
				callback( call ) {

					switch ( call.status ) {
						case 200:
							if ( call.response.loggedIn ) {
								self.user = call.response.user;
								self.openSocket();
							}
							break;
						default:
							console.error( 'Something went wrong.', call );
					}

				},
			});

		},

		register() {

		},

		login() {

			let self = this;

			new Portal({
				endpoint: '/rest/user/login',
				body: {
					name:     this.loginName,
					password: this.loginPassword,
				},
				callback( call ) {
					
					switch ( call.status ) {
						case 200:

							self.user = call.response.user;
							self.openSocket();

							self.loginName     = '';
							self.loginPassword = '';

							self.setView('home');

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
							self.setView('home');
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

		setUser( user ) {

			this.user = user;

			if ( user ) this.openSocket();

		},

		setGame( game ) {
			this.game = game;
		},

	},

});
