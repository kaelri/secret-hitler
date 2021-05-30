new Vue({

	name: 'secret-hitler',

	el: '#secret-hitler',

	data: {
		loggedIn:  Portal.getData('loggedIn'),
		loginUrl:  Portal.getData('loginUrl'),
		logoutUrl: Portal.getData('logoutUrl'),
		username:  Portal.getData('user'),
	},

	/*html*/
	template: `<main id="secret-hitler" class="main">

		<section>

			<h2>User</h2>

			<template v-if="!loggedIn">

				<a :href="loginUrl">Log in</a>

			</template>

			<template v-if="loggedIn">

				<p>{{ username }}</p>

				<a :href="logoutUrl">Log out</a>

			</template>

		</section>

	</main>`,

	methods: {

	},

});
