let mix = require('laravel-mix');

mix
.options({
  processCssUrls: false,
})
.sass( 'sass/style.scss', 'public', {
  sassOptions: {
      outputStyle: 'compressed',
  }
})
.combine([
	'lib/portal.js',
	'lib/socket/socket.io.min.js',
	'client/client.js',
], 'public/scripts.js' )
.disableNotifications();
