new Vue({

	name: 'secret-hitler',

	el: '#secret-hitler',

	data: {

		// AUTHENTICATION
		loggedIn:  Portal.getData('loggedIn'),
		loginUrl:  Portal.getData('loginUrl'),
		logoutUrl: Portal.getData('logoutUrl'),
		username:  Portal.getData('user'),

		// UI
		view: 'home',

		// NEW GAME
		newGameName: '',

	},

	/*html*/
	template: `<article id="secret-hitler">

		<header>
		
			<h2>User</h2>

			<p v-if="!loggedIn"><a :href="loginUrl">Log in</a></p>
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

	</article>`,

	methods: {

		isView( viewID ) {
			return this.view == viewID;
		},

		setView( viewID ) {
			this.view = viewID;
		},

		createGame() {
			
		},

	},

});
