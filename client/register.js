Vue.component('shRegister', {

	data() { return {
		name:     '',
		password: '',
		email:    '',
		display:  '',
	}},

	computed: {},

	/*html*/
	template: `<section id="register">

		<h2>Register</h2>

		<form
			id="register-form"
			@submit.stop.prevent="submit">

			<div>
				<label for="register-name">Username</label>
				<input type="text" name="register-name" v-model="name">
			</div>

			<div>
				<label for="register-password">Password</label>
				<input type="password" name="register-password" v-model="password">
			</div>

			<div>
				<label for="register-email">Email</label>
				<input type="email" name="email" v-model="email">
			</div>

			<div>
				<label for="register-display">Display Name</label>
				<input type="text" name="display" v-model="display">
			</div>

			<button type="button" @click.prevent="submit">Register</button>

		</form>

	</section>`,

	methods: {

		submit() {

			let self = this;

			new Portal({
				endpoint: '/rest/user/new',
				body: {
					name:     this.name,
					password: this.password,
					email:    this.email,
					display:  this.display,
				},
				callback( call ) {

					switch ( call.status ) {
						case 200:

							self.$emit( 'setUser', call.response.user );
							
							self.name     = '';
							self.password = '';
							self.email    = '';
							self.display  = '';

							self.$emit( 'setView', 'game' );

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
