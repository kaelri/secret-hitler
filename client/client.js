new Vue({

	name: 'secret-hitler',

	el: '#secret-hitler',

	data: {

		appURL:    '',
		user:      null,
		game:      null,
		socket:    null,
		socketURL: '',
		view:      '',

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

		<header class="header">

			<div class="header-pre">&nbsp;</div>

			<div class="header-title">
				<h1><a :href="appURL" @click.prevent="setViewHome">Secret Hitler</a></h1>
			</div>

			<nav class="header-nav">

				<ul v-if="!loggedIn">

					<li :class="getMenuItemClass('login')">
						<a href @click.prevent="setView('login')">
							<span class="nav-text">Login</span>
						</a>
					</li>

					<li :class="getMenuItemClass('register')">
						<a href @click.prevent="setView('register')">
							<span class="nav-text">Register</span>
						</a>
					</li>

				</ul>

				<ul v-if="loggedIn">

					<li :class="getMenuItemClass('settings')" :title="user.name">
						<a href @click.prevent="setView('settings')">
							<span class="nav-icon"><i class="fas fa-user"></i></span>
							<span class="nav-text">{{ user.display }}</span>
						</a>
					</li>

					<li :class="getMenuItemClass('home')">
						<a href @click.prevent="setView('home')">
							<span class="nav-text">Games</span>
						</a>
					</li>

					<li>
						<a href @click.prevent="logout">
							<span class="nav-text">Log out</span>
						</a>
					</li>

				</ul>

			</nav>

		</header>

		<main class="main">

			<sh-home
				v-show="isView('home')"
				:user="user"
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

		</main>

		<footer class="footer">

			<nav class="footer-nav">

				<ul>
					<li>
						<a href="https://www.secrethitler.com/" target="_blank">
							<span class="nav-icon"><i class="far fa-copyright"></i></span>
							<span class="nav-text">Goat, Wolf, & Cabbage</span>
						</a>
					</li>
					<li>
						<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
							<span class="nav-icon"><i class="fab fa-creative-commons"></i></span>
							<span class="nav-text">CC SA–BY–NC 4.0</span>
						</a>
					</li>
					<li>
						<a href="https://github.com/kaelri/secret-hitler/" target="_blank">
							<span class="nav-icon"><i class="fab fa-github"></i></span>
							<span class="nav-text">GitHub</span>
						</a>
					</li>
				</ul>

			</nav>

		</footer>

	</nav>

		<div id="portal-spinner"><i class="fas fa-cog fa-spin"></i></div>

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

		setViewHome() {
			this.setView( this.loggedIn ? 'home' : 'login' );
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

							self.appURL    = call.response.appURL;
							self.socketURL = call.response.socketURL;

							if ( call.response.user ) {
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

		getMenuItemClass( viewID ) {
			return ( this.view == viewID ) ? 'current' : '';
		},

	},

});
