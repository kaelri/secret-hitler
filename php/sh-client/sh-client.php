<?php

class shClient {

	public static $path;
	public static $url;

	public static function setup() {

		self::$path = plugin_dir_path ( __FILE__ );
		self::$url  = plugin_dir_url  ( __FILE__ );

		// PORTAL
		Portal::setup();
		Portal::enable_spinner();

		// CSS & JSx
		add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ] );
		add_action( 'wp',                 [ __CLASS__, 'do_preheader'    ] );

	}

	// CSS & JS
	public static function enqueue_scripts() {

		// FONTS
		wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap', [], null );

		// FONT AWESOME
		wp_enqueue_script ( 'font-awesome-5', '//use.fontawesome.com/releases/v5.15.2/js/all.js' );

		// VUE
		wp_enqueue_script ( 'vue', wp_get_environment_type() === 'production' ? '//cdn.jsdelivr.net/npm/vue' : '//cdn.jsdelivr.net/npm/vue/dist/vue.js' );

		// APP
		$timestamp = filemtime( self::$path . 'sh-client.js' );
		wp_enqueue_script ( 'sh-client', self::$url . 'sh-client.js', [ 'jquery', 'vue' ], $timestamp, true );

		// CSS
		$timestamp = filemtime( self::$path . 'css/main.css' );
		wp_enqueue_style ( 'main', self::$url . 'css/main.css', false, $timestamp );

	}

	// HEADER
	public static function do_preheader() {

		$data = [
			'loggedIn'  => is_user_logged_in(),
			'loginUrl'  => wp_login_url( home_url( $_SERVER['REQUEST_URI'] ) ),
			'logoutUrl' => wp_logout_url( home_url() ),
			'user'      => false,
		];

		if ( is_user_logged_in() ) {

			$user = wp_get_current_user();

			$data['user'] = $user->data->display_name;

		}

		Portal::set_data( $data );

	}

}
