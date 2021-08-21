new Vue({

	name: 'secret-hitler',

	el: '#secret-hitler',

	data: {

		// AUTHENTICATION
		loggedIn:      false,
		user:          null,

		// UI
		view: 'home',

		// REGISTER
		registerUsername: '',
		registerPassword: '',
		registerEmail:    '',

		// LOGIN
		loginUsername: '',
		loginPassword: '',

		// NEW GAME
		newGameName: '',

	},

	/*html*/
	template: `<article id="secret-hitler">

		<header>

			<h2>User</h2>

			<p v-if="!loggedIn"><a href @click.prevent="setView('login')">Log in</a> • <a href @click.prevent="setView('register')">Register</a></p>
			<p v-if="loggedIn">{{ username }} • <a :href="logoutUrl">Log out</a></p>

		</header>

		<section id="home" v-show="isView('home')">

			<h2>Games</h2>

			<a href @click.prevent="setView('create')">New Game</a>

		</section>

		<section id="create" v-show="isView('create')">

			<h2>New Game</h2>

			<input type="text" v-model="newGameName">

			<button type="button" @click.prevent="createGame">Create Game</button>

		</section>

		<section id="login" v-show="isView('register')">

			<h2>Register</h2>

			<div>
				<label for="register-username">Username</label>
				<input type="text" name="username" v-model="registerUsername">
			</div>

			<div>
				<label for="register-password">Password</label>
				<input type="password" name="password" v-model="registerPassword">
			</div>

			<div>
				<label for="register-email">Email</label>
				<input type="email" name="email" v-model="registerEmail">
			</div>

			<button type="button" @click.prevent="register">Log in</button>

		</section>

		<section id="login" v-show="isView('login')">

			<h2>Login</h2>

			<div>
				<label for="login-username">Username</label>
				<input type="text" name="username" v-model="loginUsername">
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

			let call = new Portal({
				endpoint: '/auth/register',
				body: {
					username: this.registerUsername,
					password: this.registerPassword,
					email:    this.registerEmail,
				},
				callback( call ) {
					
					switch ( call.status ) {
						case 200:
							self.user = call.response.user
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

			let call = new Portal({
				endpoint: '/auth/login',
				body: {
					username: this.loginUsername,
					password: this.loginPassword,
				},
				callback( call ) {
					console.log(call);
				},
			});

		},

		createGame() {

		},

	},

});
