Vue.component('shCreate', {

	data() { return {
		name: '',
	}},

	computed: {},

	/*html*/
	template: `<section id="create">

		<h2 class="main-title">New Game</h2>

		<form
			id="create-form"
			class="form"
			@submit.stop.prevent="submit">

			<div class="form-row">
				<div class="form-label"><label for="create-name">Game Name (optional)</label></div>
				<div class="form-input"><input type="text" name="create-name" v-model="name"></div>
			</div>

			<div class="form-buttons">
				<button type="submit" @click.prevent="submit">Create game</button>
			</div>

		</form>

	</section>`,

	methods: {

		submit() {

			let self = this;

			new Portal({
				endpoint: '/rest/game/new',
				body: {
					name: this.name
				},
				callback( call ) {

					switch ( call.status ) {
						case 200:
							self.$emit( 'setGame', call.response.game );
							self.$emit( 'setView', 'game' );
							self.name = '';
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

	},

});
