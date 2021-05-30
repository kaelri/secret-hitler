<?php

class shTheme {

	// This module’s paths.
	public static $path;
	public static $url;

	public static function setup() {

		// Set variables for this module’s URL and local file paths.
		self::$path = plugin_dir_path ( __FILE__ );
		self::$url  = plugin_dir_url  ( __FILE__ );

		// CSS & JS
		add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ] );

		// Show Portal plugin’s loading spinner.
		if ( class_exists('Portal') ) Portal::enable_spinner();

	}

	// CSS & JS
	// --------

	public static function enqueue_scripts() {

		// FONTS
		wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap', [], null );

		// JQUERY
		wp_enqueue_script ( 'jquery' );
		
		// FONT AWESOME
		wp_enqueue_script ( 'font-awesome-5', '//use.fontawesome.com/releases/v5.15.2/js/all.js' );

		// VUE
		$vue_url = ( defined('WP_DEBUG') && WP_DEBUG ) ? '//cdn.jsdelivr.net/npm/vue/dist/vue.js' : '//cdn.jsdelivr.net/npm/vue';

		wp_enqueue_script ( 'vue', $vue_url );

		// THEME
		$css_mod_time = filemtime(get_stylesheet_directory() . '/css/main.css');
		wp_enqueue_style ( 'main', get_stylesheet_directory_uri() . '/css/main.css', false, $css_mod_time );

		$js_mod_time = filemtime(get_stylesheet_directory() . '/js/main.js');
		wp_enqueue_script ( 'main', get_stylesheet_directory_uri() . '/js/main.js', ['jquery'], $js_mod_time, true );

	}

}

shTheme::setup();
