<?php

class shServer {

	// This module’s paths.
	public static $path;
	public static $url;

	public static function setup() {

		// Set variables for this module’s URL and local file paths.
		self::$path = plugin_dir_path ( __FILE__ );
		self::$url  = plugin_dir_url  ( __FILE__ );

	}

	public static function log( $data ) {

		error_log( var_export( $data, true ) );

	}

}

function shlog( $data ) {
	return shServer::log( $data );
}
