new Vue({

	name: 'secret-hitler',

	el: '#secret-hitler',

	data: {

		appURL:        '',
		socket:        null,
		socketURL:     '',
		user:          null,
		game:          null,

		// LOGIN
		loginName:     '',
		loginPassword: '',

		// VIEW
		view:          '',
		isLoading:     false,

	},

	computed: {

		loggedIn() {
			return ( this.user !== null );
		},

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

					<li :class="getMenuItemClass('home')" :title="user.name">
						<a href @click.prevent="setView('home')">
							<span class="nav-icon"><i class="fas fa-user"></i></span>
							<span class="nav-text">{{ user.display }}</span>
						</a>
					</li>

					<li
						:class="getMenuItemClass('play')"
						v-if="game">
						<a href @click.prevent="setView('play')">
							<span class="nav-text">{{ game.code }}</span>
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
				@joinGame="joinGame"
				@setView="setView">
			</sh-home>

			<sh-register
				v-show="isView('register')"
				@setView="setView"
				@setUser="setUser"
				@showLoading="showLoading"
				@hideLoading="hideLoading">
			</sh-register>

			<sh-login
				v-show="isView('login')"
				@setView="setView"
				@setUser="setUser"
				@showLoading="showLoading"
				@hideLoading="hideLoading">
			</sh-login>

			<sh-create
				v-show="isView('create')"
				@setView="setView"
				@setUser="setUser"
				@joinGame="joinGame"
				@showLoading="showLoading"
				@hideLoading="hideLoading">
			</sh-create>

			<sh-join
				v-show="isView('join')"
				@setView="setView"
				@setUser="setUser"
				@joinGame="joinGame"
				@showLoading="showLoading"
				@hideLoading="hideLoading">
			</sh-join>

			<sh-play
				v-show="isView('play')"
				:user="user"
				:game="game"
				@showLoading="showLoading"
				@hideLoading="hideLoading">
			</sh-play>

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

		<div id="loading" :class="{ loading: true, show: isLoading }"><i class="fas fa-cog fa-spin"></i></div>

	</article>`,

	mounted() {

		this.getData();

	},

	watch: {

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

		showLoading() {
			this.isLoading = true;
		},

		hideLoading() {
			this.isLoading = false;
		},

		setUser( user ) {

			this.user = user;

			if ( user ) this.openSocket();

		},

		getData() {

			this.showLoading();

			axios.post('/rest/client/get')
			.then((response) => {
				switch ( response.data.code ) {
					case 'success':

						this.appURL    = response.data.appURL;
						this.socketURL = response.data.socketURL;
		
						if ( response.data.user ) {
							this.setUser( response.data.user );
							this.setView('home');
						} else {
							this.setView('login');
						}
		
						break;
					default:
						throw new Error( `Unexpected response code: ${response.data.code}` );
						break;
				}
			})
			.catch((error) => { console.error( 'Something went wrong.', error ) })
			.then(() => { this.hideLoading() });

		},

		openSocket() {

			if ( this.socket ) this.socket.disconnect();

			this.socket = io( this.socketURL );

			this.socket.on('dev-message', (message) => console.log( `[Dev Message] ${message}` ) );

			this.socket.on( 'game-state', (data) => {

				if ( !this.game || this.game.code !== data.code ) return;

				this.getGame( data.code, data.time );

			});

		},

		closeSocket() {

			if ( this.socket ) {
				this.socket.disconnect();
				this.socket = null;
			}

		},

		logout() {

			this.showLoading();

			axios.post('/rest/user/logout')
			.then((response) => {
				switch ( response.data.code ) {
					case 'success':
						this.user = null;
						this.closeSocket();
						this.setView('login');
						break;
					default:
						throw new Error( `Unexpected response code: ${response.data.code}` );
						break;
				}
			})
			.catch((error) => { console.error( 'Something went wrong.', error ) })
			.then(() => { this.hideLoading() });

		},

		joinGame( gameCode ) {

			if ( this.game && this.game.code !== gameCode ) {
				this.socket.emit( 'leaveGame', this.game.code );
			}

			this.socket.emit( 'enterGame',  gameCode );

			this.getGame( gameCode );

		},

		getGame( code, timestamp ) {

			if ( timestamp && this.game && this.game.modified >= timestamp ) return;

			axios.post('/rest/game/get', {
				code: code
			})
			.then((response) => {
				switch ( response.data.code ) {
					case 'success':
						this.game = response.data.game;
						break;
					default:
						throw new Error( `Unexpected response code: ${response.data.code}` );
						break;
				}
			})
			.catch((error) => { console.error( 'Something went wrong.', error ) });

		},

		getMenuItemClass( viewID ) {
			return ( this.view == viewID ) ? 'current' : '';
		},

	},

});
