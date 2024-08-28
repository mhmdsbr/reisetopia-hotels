<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://reisetopia.de
 * @since      1.0.0
 *
 * @package    Reisetopia_Hotels
 * @subpackage Reisetopia_Hotels/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Reisetopia_Hotels
 * @subpackage Reisetopia_Hotels/includes
 * @author     Mohammad Saber <saaber.mohamad@gmail.com>
 */
class Reisetopia_Hotels_i18n {

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'reisetopia-hotels',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}

}
