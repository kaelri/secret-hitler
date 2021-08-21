new Vue({

	name: 'secret-hitler',

	el: '#secret-hitler',

	data: {

		// AUTHENTICATION
		loggedIn: secretHitlerData.loggedIn ?? false,
		user:     secretHitlerData.user     ?? null,

		// UI
		view: 'home',

		// REGISTER
		registerName:     '',
		registerPassword: '',
		registerEmail:    '',
		registerDisplay:  '',

		// LOGIN
		loginName:     '',
		loginPassword: '',

		// NEW GAME
		newName: '',

	},

	/*html*/
	template: `<article id="secret-hitler">

		<header>

			<h2>User</h2>

			<p v-if="!loggedIn"><a href @click.prevent="setView('login')">Log in</a> • <a href @click.prevent="setView('register')">Register</a></p>
			<p v-if="loggedIn"><span :title="user.name">{{ user.display }}</span> • <a href @click.prevent="logout">Log out</a></p>

		</header>

		<section id="home" v-show="isView('home')">

			<h2>Games</h2>

			<a href @click.prevent="setView('create')">New Game</a>

		</section>

		<section id="create" v-show="isView('create')">

			<h2>New Game</h2>

			<input type="text" v-model="newName">

			<button type="button" @click.prevent="createGame">Create Game</button>

		</section>

		<section id="login" v-show="isView('register')">

			<h2>Register</h2>

			<div>
				<label for="register-name">Username</label>
				<input type="text" name="register-name" v-model="registerName">
			</div>

			<div>
				<label for="register-password">Password</label>
				<input type="password" name="register-password" v-model="registerPassword">
			</div>

			<div>
				<label for="register-email">Email</label>
				<input type="email" name="email" v-model="registerEmail">
			</div>

			<div>
				<label for="register-display">Display Name</label>
				<input type="text" name="display" v-model="registerDisplay">
			</div>

			<button type="button" @click.prevent="register">Log in</button>

		</section>

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

	methods: {

		isView( viewID ) {
			return this.view == viewID;
		},

		setView( viewID ) {
			this.view = viewID;
		},

		register() {

			let self = this;

			new Portal({
				endpoint: '/auth/register',
				body: {
					name:     this.registerName,
					password: this.registerPassword,
					email:    this.registerEmail,
					display:  this.registerDisplay,
				},
				callback( call ) {

					switch ( call.status ) {
						case 200:
							self.loggedIn = call.response.loggedIn
							self.user     = call.response.user
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

		login() {

			let self = this;

			new Portal({
				endpoint: '/auth/login',
				body: {
					name:     this.loginName,
					password: this.loginPassword,
				},
				callback( call ) {
					
					switch ( call.status ) {
						case 200:
							self.loggedIn = call.response.loggedIn
							self.user     = call.response.user
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
				endpoint: '/auth/logout',
				body: {},
				callback( call ) {
					
					switch ( call.status ) {
						case 200:
							self.loggedIn = call.response.loggedIn
							self.user     = call.response.user
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

		createGame() {

		},

	},

});
