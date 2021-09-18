Vue.component('shHome', {

	props: [ 'user' ],

	data() { return {

	}},

	computed: {

		gamesList() {

			const gamesList = [];

			if ( !this.user ) return gamesList;

			for (let i = 0; i < Object.keys(this.user.games).length; i++) {
				const code = Object.keys(this.user.games)[i];
				const game = this.user.games[ code ];

				gamesList.push(game);

			}

			return gamesList;

		},

		hasGames() {
			return ( this.gamesList.length > 0 );
		},

	},

	/*html*/
	template: `<section id="home" class="panel">

		<h2 class="main-title">Games</h2>

		<ul
			class="cards"
			v-if="hasGames">

			<li
				v-for="game in gamesList"
				:key="game.code"
				@click="setGame( game.id )">

				<div class="card-code">{{ game.code }}</div>

				<div class="card-name">{{ getGameDisplayName( game ) }}</div>

			</li>

		</ul>

		<p v-if="!hasGames">No games yet.</p>

		<ul class="buttons">
			<li><button @click.prevent="setView('join')">Join</button></li>
			<li><button @click.prevent="setView('create')">Create</button></li>
		</ul>

	</section>`,

	methods: {

		setView( viewID ) {
			this.$emit( 'setView', viewID );
		},

		setGame( gameID ) {
			this.$emit( 'setGame', gameID );
			this.setView('game');
		},

		getGameDisplayName( game ) {
			return ( game.name.length ? game.name : 'Secret Hitler' );
		},

	},

});
