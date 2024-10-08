<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * templates-facing side of the site and the admin area.
 *
 * @link       https://reisetopia.de
 * @since      1.0.0
 *
 * @package    Reisetopia_Hotels
 * @subpackage Reisetopia_Hotels/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * templates-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Reisetopia_Hotels
 * @subpackage Reisetopia_Hotels/includes
 * @author     Mohammad Saber <saaber.mohamad@gmail.com>
 */
class Reisetopia_Hotels {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Reisetopia_Hotels_Loader    $loader    Maintains and registers all hooks
	 */
	protected Reisetopia_Hotels_Loader $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $reisetopia_hotels    The string used to uniquely identify this plugin.
	 */
	protected string $reisetopia_hotels;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected string $version;

    /**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the templates-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'REISETOPIA_HOTELS_VERSION' ) ) {
			$this->version = REISETOPIA_HOTELS_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->reisetopia_hotels = 'reisetopia-hotels';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Reisetopia_Hotels_Loader. Orchestrates the hooks of the plugin.
	 * - Reisetopia_Hotels_i18n. Defines internationalization functionality.
	 * - Reisetopia_Hotels_Admin. Defines all hooks for the admin area.
	 * - Reisetopia_Hotels_Public. Defines all hooks for the templates side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {
        // Include the class that orchestrates the actions and filters of th core plugin.
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-reisetopia-hotels-loader.php';

		// Include the class that defines internationalization functionality of the plugin.
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-reisetopia-hotels-i18n.php';

        // Include the class that defines all actions that occur in the templates-facing side of the site.
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-reisetopia-hotels-public.php';

        // Include the class that registers the custom post type (CPT) for hotels.
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-reisetopia-hotels-cpt.php';

        // Include the class that defines the REST API endpoints for querying hotel data.
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-reisetopia-hotels-rest-api.php';

        // Include the class that defines the AJAX API handlers for querying hotel data.
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-reisetopia-hotels-ajax-api.php';

        // Include the class that handles hotels queries and filtering logic.
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-reisetopia-hotels-manager.php';
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-reisetopia-hotels-query.php';

        $this->loader = new Reisetopia_Hotels_Loader();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Reisetopia_Hotels_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Reisetopia_Hotels_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all the hooks related to the templates-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {
        // Making new Class instances
		$reisetopia_hotels_public = new Reisetopia_Hotels_Public( $this->get_reisetopia_hotels(), $this->get_version() );
        $reisetopia_hotels_cpt = new Reisetopia_Hotels_Cpt();
        $reisetopia_hotels_rest_api = new Reisetopia_Hotels_Rest_API();
        $reisetopia_hotels_ajax_api = new Reisetopia_Hotels_Ajax_API();

		$this->loader->add_action( 'wp_enqueue_scripts', $reisetopia_hotels_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $reisetopia_hotels_public, 'enqueue_scripts' );

        // Registers Custom Post Type Hotels
        $this->loader->add_action('init', $reisetopia_hotels_cpt, 'register_reisetopia_hotel_cpt');

        // Registers ACF fields related to Hotels
        if( function_exists('acf_add_local_field_group') ) {
            $this->loader->add_action('acf/init', $reisetopia_hotels_cpt, 'register_reisetopia_hotels_acf_fields');
        }

        // Registers REST Endpoint
        $this->loader->add_action('rest_api_init', $reisetopia_hotels_rest_api, 'register_routes');

        // Registers Ajax Endpoint
        $this->loader->add_action('wp_ajax_reisetopia_hotels_get_all', $reisetopia_hotels_ajax_api, 'handle_get_all_hotels');
        $this->loader->add_action('wp_ajax_nopriv_reisetopia_hotels_get_all', $reisetopia_hotels_ajax_api, 'handle_get_all_hotels');
        $this->loader->add_action('wp_ajax_reisetopia_hotels_get_by_id', $reisetopia_hotels_ajax_api, 'handle_get_hotel_by_id');
        $this->loader->add_action('wp_ajax_nopriv_reisetopia_hotels_get_by_id', $reisetopia_hotels_ajax_api, 'handle_get_hotel_by_id');

        // Adds ajax nonce in DOM footer
        $this->loader->add_action('wp_footer', $reisetopia_hotels_ajax_api, 'output_ajax_nonce');

        // Adds ajax to show the hotels
        $this->loader->add_action( 'wp_ajax_get_all_hotels', $reisetopia_hotels_public, 'reisetopia_handle_ajax_request' );
        $this->loader->add_action( 'wp_ajax_nopriv_get_all_hotels', $reisetopia_hotels_public, 'reisetopia_handle_ajax_request' );

	}

	/**
	 * Run the loader to execute all the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string
	 */
	public function get_reisetopia_hotels(): string
    {
		return $this->reisetopia_hotels;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Reisetopia_Hotels_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader(): Reisetopia_Hotels_Loader
    {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version(): string
    {
		return $this->version;
	}

}
