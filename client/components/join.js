Vue.component('shJoin', {

	data() { return {
		code: '',
	}},

	computed: {},

	/*html*/
	template: `<section id="join" class="panel">

		<h2 class="main-title">Join Game</h2>

		<form
			id="join-form"
			class="form"
			@submit.stop.prevent="submit">

			<div class="form-row">
				<div class="form-label"><label for="join-code">Game Code</label></div>
				<div class="form-input"><input type="text" name="join-code" v-model="code" placeholder="Secret Hitler"></div>
			</div>

			<div class="form-buttons">
				<button type="submit" @click.prevent="submit">Join game</button>
			</div>

		</form>

	</section>`,

	methods: {

		submit() {

			this.$emit('showLoading');

			axios.post('/rest/game/join', {
				code: this.code
			})
			.then((response) => {
				switch ( response.data.code ) {
					case 'success':

						this.$emit( 'setUser',  response.data.user     );
						this.$emit( 'joinGame', response.data.gameCode );
						this.$emit( 'setView',  'play' );
						this.code = '';

						break;
					case 'game-not-found':


						break;
					default:
						throw new Error( `Unexpected response code: ${response.data.code}` );
						break;
				}
			}).catch((error) => { console.error( 'Something went wrong.', error ); })
			.then(() => { this.$emit('hideLoading') });

		},

	},

});
