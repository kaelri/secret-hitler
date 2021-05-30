<?php

class Portal {

	public static $path;
	public static $url;

	public static $data       = [];
	public static $do_spinner = false;

	public static function setup() {

		// Set variables for this module’s URL and local file paths.
		self::$path = plugin_dir_path ( __FILE__ );
		self::$url  = plugin_dir_url  ( __FILE__ );

		add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts'  ] );

	}

	// GET & SET DATA
	// --------------

	public static function set_data( ...$args ) {

		$new_data = null;

		if ( empty($args) ) {
			return new WP_Error('no-data', __FUNCTION__ . ' received no arguments. Provide either an array of key-value pairs, or two arguments for $key and $value.');
		}

		if ( count($args) === 1 && is_array($args[0]) ) {

			$new_data = $args[0];

		} elseif ( count($args) === 2 && is_string( $args[0]) ) {

			$new_data = [ $args[0] => $args[1] ];

		}

		if ( empty($new_data) ) {
			return new WP_Error('bad-data', __FUNCTION__ . ' received bad data. Provide either an array of key-value pairs, or two arguments for $key and $value.');
		}

		self::$data = array_merge( self::$data, $new_data );

		return true;

	}

	public static function has_data( string $key = '' ) {

		if ( empty($key) ) {

			$has_data = empty( self::$data );

		} else {

			$has_data = array_key_exists( $key, self::$data );
		}

		return (bool) $has_data;

	}

	public static function get_data( string $key = '' ) {

		if ( empty($key) ) {

			$data = self::$data;

		} elseif ( !array_key_exists( $key, self::$data ) ) {

			$data = new WP_Error('key-does-not-exist', 'Portal does not have any data with this key.');

		} else {

			$data = self::$data[ $key ] ?? null;

		}

		return $data;

	}

	// OUTPUT
	// ------

	public static function enqueue_scripts() {

		$timestamp = filemtime( self::$path . 'portal.js' );

		wp_enqueue_script( 'portal', self::$url . 'portal.js', [], $timestamp );

		if ( !array_key_exists( 'restURL', self::$data ) ) {
			self::$data[ 'restURL' ] = home_url('/wp-json/');
		}

		wp_localize_script( 'portal', 'portalInitialData', [ 'data' => self::$data ] );

	}

	// LOADING SPINNER (OPTIONAL)
	// --------------------------

	public static function enable_spinner( bool $do_html = true, bool $do_css = true  ) {

		if ( empty( self::$path ) || self::$do_spinner ) return;

		self::$do_spinner = true;

		if ( $do_css  ) add_action( 'wp_enqueue_scripts', [ __CLASS__, 'do_spinner_css'  ] );
		if ( $do_html ) add_action( 'wp_footer',          [ __CLASS__, 'do_spinner_html' ] );

	}

	public static function do_spinner_html() {

		?><div id="portal-spinner"><i class="fas fa-cog fa-spin"></i></div><?php

	}

	public static function do_spinner_css() {

		$timestamp = filemtime( self::$path . 'portal-spinner.css' );

		wp_enqueue_style( 'portal-spinner', self::$url . 'portal-spinner.css', false, $timestamp );

	}

}
