<?php

class shGame {

	public static function setup() {

		add_action( 'init', [ __CLASS__, 'register_post_type' ], 0 );

	}

	public static function register_post_type() {

		register_post_type( 'sh_game', [
			'label'               => 'Games',
			'supports'            => [ 'title', 'custom-fields' ],
			'capability_type'     => 'post',
			'show_ui'             => true,
			'menu_position'       => 25,
			'menu_icon'           => 'dashicons-games',
		]);

	}

	// INSTANCE



}
