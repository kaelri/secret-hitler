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
	'client/components/*.js',
	'client/client.js',
], 'public/js/scripts.js' )
.disableNotifications();
