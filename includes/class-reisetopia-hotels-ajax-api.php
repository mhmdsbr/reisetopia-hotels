<?php

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
        $name = isset($_POST['name']) ? sanitize_text_field($_POST['name']) : '';
        $location = isset($_POST['location']) ? sanitize_text_field($_POST['location']) : '';
        $max_price = isset($_POST['maxPrice']) ? intval(sanitize_text_field($_POST['maxPrice'])) : 0;

        // Build query args
        $args = [
            'post_type' => 'reisetopia_hotel',
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'meta_query' => [],
        ];

        if (!empty($name)) {
            $args['s'] = $name;
        }

        if (!empty($location)) {
            $args['meta_query'][] = [
                'relation' => 'OR',
                [
                    'key'     => 'city',
                    'value'   => $location,
                    'compare' => 'LIKE',
                ],
                [
                    'key'     => 'country',
                    'value'   => $location,
                    'compare' => 'LIKE',
                ],
            ];
        }

        if ($max_price > 0) {
            $args['meta_query'][] = [
                'key'     => 'price_max',
                'value'   => $max_price,
                'type'    => 'NUMERIC',
                'compare' => '<=',
            ];
        }

        // Query the hotels
        $query = new WP_Query($args);
        $hotels = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $hotels[] = $this->format_hotel_response(get_the_ID());
            }
        }

        wp_reset_postdata();

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
        $hotel = $this->format_hotel_response($id);

        if (empty($hotel)) {
            wp_send_json_error(['message' => 'Hotel not found'], 404);
        } else {
            wp_send_json_success($hotel);
        }
    }

    /**
     * Formats hotel data for response.
     *
     * @param int $id The ID of the hotel post.
     * @return array The formatted hotel data.
     */
    private function format_hotel_response(int $id): array {
        $hotel_data = [
            'id' => $id,
            'title' => get_the_title($id),
            'city' => get_field('city', $id),
            'country' => get_field('country', $id),
            'priceRange' => [
                'min' => (int) get_field('price_min', $id),
                'max' => (int) get_field('price_max', $id),
            ],
        ];

        $rating = get_field('rating', $id);
        if (!empty($rating)) {
            $hotel_data['rating'] = (float) $rating;
        }

        return $hotel_data;
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
