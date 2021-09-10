new Vue({

	name: 'secret-hitler',

	el: '#secret-hitler',

	data: {

		appURL:    null,
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

		<header class="header">

			<div class="header-pre">&nbsp;</div>

			<div class="header-title">
				<h1><a :href="appURL" @click.prevent="setViewHome">Secret Hitler</a></h1>
			</div>

			<nav class="header-nav">

				<ul v-if="!loggedIn">
					<li :class="getMenuItemClass('login')"><a href @click.prevent="setView('login')">Log in</a></li>
					<li :class="getMenuItemClass('register')"><a href @click.prevent="setView('register')">Register</a></li>
				</ul>

				<ul v-if="loggedIn">
					<li :class="getMenuItemClass('settings')" :title="user.name"><a href @click.prevent="setView('settings')">{{ user.display }}</a></li>
					<li :class="getMenuItemClass('home')"><a href @click.prevent="setView('home')">Games</a></li>
					<li :class="getMenuItemClass('create')"><a href @click.prevent="setView('create')">New</a></li>
					<li :class="getMenuItemClass('join')"><a href @click.prevent="setView('join')">Join</a></li>
					<li><a href @click.prevent="logout">Log out</a></li>
				</ul>

			</nav>

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
