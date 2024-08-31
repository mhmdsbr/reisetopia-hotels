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
     * Variable to hold the manifest file contents
     *
     * @var array|false
     */
    protected array|false $manifest = [];

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

        add_shortcode('reisetopia-hotels', [$this, 'reisetopia_hotels_shortcode']);

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

        // Load the manifest file
        $this->manifest = $this->get_manifest();

        if (is_array($this->manifest)) {
            $styles = $this->load_asset_from_manifest('app.css');
            if ($styles) {
                wp_enqueue_style($this->reisetopia_hotels, plugin_dir_url(__FILE__) . 'assets/css/' . $styles, array(), $this->version, 'all');
            }
        }

	}

	/**
	 * Register the JavaScript for the templates-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Reisetopia_Hotels_Loader as all the hooks are defined
		 * in that particular class.
		 *
		 * The Reisetopia_Hotels_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

        // Load the manifest file
        $this->manifest = $this->get_manifest();

        // Check if manifest is an array
        if (is_array($this->manifest)) {
            $scripts = $this->load_asset_from_manifest('app.js');
            if ($scripts) {
                wp_enqueue_script($this->reisetopia_hotels, plugin_dir_url(__FILE__) . 'assets/js/' . $scripts, ['jquery'], $this->version, true);

                wp_localize_script($this->reisetopia_hotels, 'reisetopiaHotels', array(
                    'ajax_url' => admin_url('admin-ajax.php'),
                    'rest_url' => get_rest_url(null, 'reisetopia-hotels/v1/hotels'),
                ));
            }
        }
	}

    /**
     * Fetch the manifest.json file if it is available
     *
     * @return false|array
     */
    private function get_manifest(): array|false
    {
        $manifest_path = plugin_dir_path(__FILE__) . 'assets/manifest.json';
        if (file_exists($manifest_path)) {
            $manifest_content = file_get_contents($manifest_path);
            $manifest = json_decode($manifest_content, true);
            return $manifest ?: false;
        }
        return false;
    }

    /**
     * Check if the asset is in the manifest and return the filename
     *
     * @param string $file
     * @return false|string
     */
    private function load_asset_from_manifest(string $file): bool|string
    {
        if (is_array($this->manifest) && isset($this->manifest[$file])) {
            $paths = explode('/', $this->manifest[$file]);
            return end($paths);
        }
        return false;
    }


    /**
     * Shortcode [reisetopia-hotels] implementation.
     *
     * @return string
     */
    function reisetopia_hotels_shortcode(): string
    {
        ob_start();

        include plugin_dir_path( __FILE__ ) . 'templates/reisetopia-hotels-display.php';

        return ob_get_clean();
    }

    /**
     * AJAX handler for fetching hotels.
     */
    function reisetopia_handle_ajax_request() {
        check_ajax_referer('reisetopia_hotels_nonce', 'nonce');

        $api = new Reisetopia_Hotels_Ajax_API();
        $api->handle_get_all_hotels();
    }

}
