Vue.component('shLogin', {

	data() { return {
		name:     '',
		password: '',
	}},

	computed: {},

	/*html*/
	template: `<section id="login" class="panel">

		<h2 class="main-title">Login</h2>

		<form
			id="login-form"
			class="form"
			@submit.prevent="submit">

			<div class="form-row">
				<div class="form-label"><label for="login-name">Username</label></div>
				<div class="form-input"><input type="text" name="login-name" v-model="name"></div>
			</div>

			<div class="form-row">
				<div class="form-label"><label for="login-password">Password</label></div>
				<div class="form-input"><input type="password" name="password" v-model="password"></div>
			</div>

			<div class="form-buttons">
				<button type="submit" @click.prevent="submit">Log in</button>
			</div>

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
