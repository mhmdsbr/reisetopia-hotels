<?php

/**
 * Class Reisetopia_Hotels_Ajax_API
 *
 * This class handles the AJAX requests for querying hotel data.
 * It includes methods for fetching all hotels with optional filters,
 * as well as fetching a single hotel by its ID.
 */
class Reisetopia_Hotels_Ajax_API {

    /**
     * Handles the AJAX request to get all hotels with optional filters (name, location, max_price).
     */
    public function handle_get_all_hotels() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'reisetopia_hotels_nonce')) {
            wp_send_json_error(['message' => 'Invalid nonce'], 400);
            return;
        }

        // Sanitize and collect parameters
        $query = new Reisetopia_Hotels_Query();

        if (!empty($_POST['name'])) {
            $query->set_name_filter(sanitize_text_field($_POST['name']));
        }

        if (!empty($_POST['location'])) {
            $query->set_location_filter(sanitize_text_field($_POST['location']));
        }

        if (!empty($_POST['maxPrice'])) {
            $query->set_max_price_filter((int) sanitize_text_field($_POST['maxPrice']));
        }

        // Query the hotels
        $hotels = $query->get_hotels();

        // Return the list of hotels
        wp_send_json_success($hotels);
    }

    /**
     * Handles the AJAX request to get a single hotel by ID.
     */
    public function handle_get_hotel_by_id() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'reisetopia_hotels_nonce')) {
            wp_send_json_error(['message' => 'Invalid nonce'], 400);
            return;
        }

        // Sanitize and collect the ID parameter
        $id = isset($_POST['id']) ? absint($_POST['id']) : 0;

        if (!$id) {
            wp_send_json_error(['message' => 'Invalid hotel ID'], 400);
            return;
        }

        if (get_post_type($id) !== 'reisetopia_hotel') {
            wp_send_json_error(['message' => 'Hotel not found'], 404);
            return;
        }

        // Get the hotel data
        $query = new Reisetopia_Hotels_Query();
        $hotel = $query->format_hotel_response($id);

        if (empty($hotel)) {
            wp_send_json_error(['message' => 'Hotel not found'], 404);
        } else {
            wp_send_json_success($hotel);
        }
    }

    /**
     * Outputs the AJAX nonce in the HTML for use in JavaScript.
     */
    public static function output_ajax_nonce() {
        $nonce = wp_create_nonce('reisetopia_hotels_nonce');

        echo '<script type="text/javascript">';
        echo 'const reisetopiaHotelsNonce = "' . esc_js($nonce) . '";';
        echo '</script>';
    }
}
