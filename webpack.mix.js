let mix = require('laravel-mix');

mix
.options({
  processCssUrls: false,
})
.sass( 'public/sass/style.scss', 'public/css', {
  sassOptions: {
      outputStyle: 'compressed',
  }
})
.combine([
	'client/home.js',
	'client/register.js',
	'client/login.js',
	'client/create.js',
	'client/client.js',
], 'public/js/scripts.js' )
.disableNotifications();
