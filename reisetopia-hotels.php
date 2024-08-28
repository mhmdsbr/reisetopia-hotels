<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://reisetopia.de
 * @since             1.0.0
 * @package           Reisetopia_Hotels
 *
 * @wordpress-plugin
 * Plugin Name:       Reisetopia Hotels
 * Plugin URI:        https://reisetopia.de
 * Description:       The plugin shows a list of all available Reisetopia Hotels with some nice filtering
 * Version:           1.0.0
 * Author:            Mohammad Saber
 * Author URI:        https://mohammadsaber.com
 * License:           GPL-2.0+
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       reisetopia-hotels
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
const REISETOPIA_HOTELS_VERSION = '1.0.0';

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-reisetopia-hotels-activate.php
 */
function activate_reisetopia_hotels() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-reisetopia-hotels-activate.php';
	Reisetopia_Hotels_Activate::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-reisetopia-hotels-deactivate.php
 */
function deactivate_reisetopia_hotels() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-reisetopia-hotels-deactivate.php';
    Reisetopia_Hotels_Deactivate::deactivate();
}

register_activation_hook( __FILE__, 'activate_reisetopia_hotels' );
register_deactivation_hook( __FILE__, 'deactivate_reisetopia_hotels' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and templates-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-reisetopia-hotels.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_reisetopia_hotels() {

	$plugin = new Reisetopia_Hotels();
	$plugin->run();

}
run_reisetopia_hotels();
