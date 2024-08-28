<?php

/**
 * The templates-facing functionality of the plugin.
 *
 * @link       https://reisetopia.de
 * @since      1.0.0
 *
 * @package    Reisetopia_Hotels
 * @subpackage Reisetopia_Hotels/templates
 */

/**
 * The templates-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the templates-facing stylesheet and JavaScript.
 *
 * @package    Reisetopia_Hotels
 * @subpackage Reisetopia_Hotels/templates
 * @author     Mohammad Saber <saaber.mohamad@gmail.com>
 */
class Reisetopia_Hotels_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $reisetopia_hotels    The ID of this plugin.
	 */
	private string $reisetopia_hotels;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private string $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string    $reisetopia_hotels The name of the plugin.
	 * @param      string $version    The version of this plugin.
	 *@since    1.0.0
	 */
	public function __construct(string $reisetopia_hotels, string $version ) {

		$this->reisetopia_hotels = $reisetopia_hotels;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the templates-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Reisetopia_Hotels_Loader as all the hooks are defined
		 * in that particular class.
		 *
		 * The Reisetopia_Hotels_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->reisetopia_hotels, plugin_dir_url( __FILE__ ) . 'assets/css/app.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the templates-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Reisetopia_Hotels_Loader as all the hooks are defined
		 * in that particular class.
		 *
		 * The Reisetopia_Hotels_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->reisetopia_hotels, plugin_dir_url( __FILE__ ) . 'assets/js/app.js', array( 'jquery' ), $this->version, false );

	}

}
