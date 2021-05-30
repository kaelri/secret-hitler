<?php

class shServer {

	public static $path;
	public static $url;

	public static function setup() {

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
