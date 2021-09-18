Vue.component('shRegister', {

	data() { return {
		name:     '',
		password: '',
		email:    '',
		display:  '',
	}},

	computed: {},

	/*html*/
	template: `<section id="register" class="panel">

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

			this.$emit('showLoading');

			axios.post('/rest/user/new', {
				name:     this.name,
				password: this.password,
				email:    this.email,
				display:  this.display,
			})
			.then((response) => {
				switch ( response.data.code ) {
					case 'success':

						this.$emit( 'setUser', response.data.user );

						this.name     = '';
						this.password = '';
						this.email    = '';
						this.display  = '';

						this.$emit( 'setView', 'home' );

						break;
					case 'user-exists':
						console.error('A user already exists with this name.');
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
