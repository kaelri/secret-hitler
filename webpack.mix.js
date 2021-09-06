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
	'lib/socket/socket.io.min.js',
	'lib/portal/portal.js',
	'client/home.js',
	'client/register.js',
	'client/create.js',
	'client/client.js',
], 'public/js/scripts.js' )
.disableNotifications();
