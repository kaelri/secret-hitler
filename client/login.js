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

			this.$emit('showLoading');

			axios.post('/rest/user/login', {
				name:     this.name,
				password: this.password,
			})
			.then((response) => {
				switch ( response.data.code ) {
					case 'success':

						this.$emit( 'setUser', response.data.user );

						this.name     = '';
						this.password = '';
		
						this.$emit( 'setView', 'home' );

						break;
					case 'bad-credentials':
						console.error('Your username or password is incorrect.');
						break;
					default:
						throw new Error( `Unexpected response code: ${response.data.code}` );
						break;
				}
			})
			.catch((error) => { console.error( 'Something went wrong.', error ) })
			.then(() => { this.$emit('hideLoading') });

		},

	},

});
