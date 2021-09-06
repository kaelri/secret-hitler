Vue.component('shHome', {

	data() { return {

	}},

	computed: {},

	/*html*/
	template: `<section id="home">

		<h2>Games</h2>

		<a href @click.prevent="setView('create')">New Game</a>

	</section>`,

	methods: {

		setView( viewID ) {
			this.$emit( 'setView', viewID );
		}

	},

});
