Vue.component('shHome', {

	data() { return {

	}},

	computed: {},

	/*html*/
	template: `<section id="home" class="panel">

		<h2 class="main-title">Games</h2>

	</section>`,

	methods: {

		setView( viewID ) {
			this.$emit( 'setView', viewID );
		}

	},

});
