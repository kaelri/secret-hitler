Vue.component('shCreate', {

	data() { return {
		name: '',
	}},

	computed: {},

	/*html*/
	template: `<section id="create" class="panel">

		<h2 class="main-title">New Game</h2>

		<form
			id="create-form"
			class="form"
			@submit.stop.prevent="submit">

			<div class="form-row">
				<div class="form-label"><label for="create-name">Game Name (optional)</label></div>
				<div class="form-input"><input type="text" name="create-name" v-model="name" placeholder="Secret Hitler"></div>
			</div>

			<div class="form-buttons">
				<button type="submit" @click.prevent="submit">Create game</button>
			</div>

		</form>

	</section>`,

	methods: {

		submit() {

			this.$emit('showLoading');

			axios.post('/rest/game/new', {
				name: this.name
			})
			.then((response) => {
				switch ( response.data.code ) {
					case 'success':

						this.$emit( 'setUser',  response.data.user     );
						this.$emit( 'joinGame', response.data.gameCode );
						this.$emit( 'setView',  'play' );
						this.name = '';

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
