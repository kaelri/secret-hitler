Vue.component('shLogin', {

	data() { return {
		name:     '',
		password: '',
	}},

	computed: {},

	/*html*/
	template: `<section id="login">

		<h2>Login</h2>

		<form
			id="login-form"
			@submit.prevent="submit">

			<div>
				<label for="login-name">Username</label>
				<input type="text" name="login-name" v-model="name">
			</div>

			<div>
				<label for="login-password">Password</label>
				<input type="password" name="password" v-model="password">
			</div>

			<button type="submit" @click.prevent="submit">Log in</button>

		</form>

	</section>`,

	methods: {

		submit() {

			let self = this;

			new Portal({
				endpoint: '/rest/user/login',
				body: {
					name:     this.name,
					password: this.password,
				},
				silent: false,
				callback( call ) {

					switch ( call.status ) {
						case 200:

							self.$emit( 'setUser', call.response.user );
							
							self.name     = '';
							self.password = '';

							self.$emit( 'setView', 'home' );

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
