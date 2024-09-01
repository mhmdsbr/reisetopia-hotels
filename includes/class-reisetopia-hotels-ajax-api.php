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

        $name = isset($_POST['name']) ? sanitize_text_field($_POST['name']) : '';
        $location = isset($_POST['location']) ? sanitize_text_field($_POST['location']) : '';
        $max_price = isset($_POST['max_price']) ? sanitize_text_field($_POST['max_price']) : '';
        $sort_attribute = isset($_POST['sort_attribute']) ? sanitize_text_field($_POST['sort_attribute']) : 'title';
        $sort_order = isset($_POST['sort_order']) ? sanitize_text_field($_POST['sort_order']) : 'ASC';

        // Fetch hotels using the Reisetopia_Hotels_Manager class with sorting
        $hotels = Reisetopia_Hotels_Manager::filter_hotels($name, $location, $max_price, $sort_attribute, $sort_order);

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
        $hotel = Reisetopia_Hotels_Manager::get_hotel_data_by_id($id);

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
