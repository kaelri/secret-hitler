<!DOCTYPE html>

<html <?php language_attributes(); ?>>

<head>

	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width" />
	<meta name="robots" content="noindex">

	<title><?=esc_attr( get_bloginfo( 'name' ) )?></title>

	<?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>

	<?php wp_body_open(); ?>

	<main class="main" id="secret-hitler"></main>
	
	<?php wp_footer(); ?>

</body>
</html>
