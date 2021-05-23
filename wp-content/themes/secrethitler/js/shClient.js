var shClient = null;

jQuery(document).ready(function(){

	shClient = new Vue({
		
		el: '#secret-hitler',

		data: {
			url: '',
		},

		/*html*/
		template: `<article id="sh-client">

			<h1>Secret Hitler!</h1>

		</article>`,

		beforeMount: function () {
			this.url = this.$el.attributes['data-url'].value;
		},

		methods: {

		},

	});

});
