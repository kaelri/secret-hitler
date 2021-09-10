Vue.component('shHome', {

	data() { return {

	}},

	computed: {},

	/*html*/
	template: `<section id="home" class="panel-narrow">

		<h2>Games</h2>

	</section>`,

	methods: {

		setView( viewID ) {
			this.$emit( 'setView', viewID );
		}

	},

});
