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

		<h2 class="main-title">Register</h2>

		<form
			id="register-form"
			class="form"
			@submit.prevent="submit">

			<div class="form-row">
				<div class="form-label"><label for="register-name">Username</label></div>
				<div class="form-input"><input type="text" name="register-name" v-model="name"></div>
			</div>

			<div class="form-row">
				<div class="form-label"><label for="register-password">Password</label></div>
				<div class="form-input"><input type="password" name="register-password" v-model="password"></div>
			</div>

			<div class="form-row">
				<div class="form-label"><label for="register-email">Email</label></div>
				<div class="form-input"><input type="email" name="email" v-model="email"></div>
			</div>

			<div class="form-row">
				<div class="form-label"><label for="register-display">Display Name</label></div>
				<div class="form-input"><input type="text" name="display" v-model="display"></div>
			</div>

			<div class="form-buttons">
				<button type="submit" @click.prevent="submit">Register</button>
			</div>

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
