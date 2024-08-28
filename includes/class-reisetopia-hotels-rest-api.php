<?php

/**
 * Class Reisetopia_Hotels_Rest_API
 *
 * This class handles the creation of REST API endpoints for querying hotel data.
 * It includes routes for fetching all hotels with optional filters, as well as fetching
 * a single hotel by its ID. The class also implements error handling and logging for edge cases.
 */
class Reisetopia_Hotels_Rest_API {

    /**
     * Registers the REST API routes.
     *
     * This method is responsible for registering the routes with WordPress using the `register_rest_route` function.
     * It sets up two routes: one for retrieving all hotels with optional filters, and another for retrieving
     * a single hotel by its ID.
     */
    public function register_routes(): void {
        // Route to get all hotels with optional filters (name, location, max_price)
        register_rest_route('reisetopia-hotels/v1', '/hotels', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_all_hotels'],
            'permission_callback' => '__return_true',
            'args' => [
                'name' => [
                    'validate_callback' => fn($param) => is_string($param),
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'location' => [
                    'validate_callback' => fn($param) => is_string($param),
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'max_price' => [
                    'validate_callback' => fn($param) => is_numeric($param),
                    'sanitize_callback' => fn($param) => (int) sanitize_text_field($param),
                ],
            ],
        ]);

        // Route to get a single hotel by ID
        register_rest_route('reisetopia-hotels/v1', '/hotels/(?P<id>\d+)', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_hotel_by_id'],
            'permission_callback' => '__return_true',
            'args' => [
                'id' => [
                    'validate_callback' => fn($param) => is_numeric($param),
                    'sanitize_callback' => 'absint',
                ],
            ],
        ]);
    }

    /**
     * Handles the request to get all hotels with optional filters.
     *
     * This method processes the REST API request to retrieve a list of hotels. It supports filtering by
     * name, location, and maximum price. The method constructs a `WP_Query` based on the provided parameters
     * and returns the filtered list of hotels. It also logs errors if any issues arise during data processing.
     *
     * @param WP_REST_Request $request The request object containing any query parameters.
     * @return WP_REST_Response The response object containing the filtered list of hotels or an error message.
     */
    public function get_all_hotels(WP_REST_Request $request): WP_REST_Response {
        $args = [
            'post_type' => 'reisetopia_hotel',
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'meta_query' => [],
        ];

        // Filter by name if provided
        if ($name = $request->get_param('name')) {
            $args['s'] = $name;
        }

        // Filter by location if provided
        if ($location = $request->get_param('location')) {
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

        // Filter by maximum price if provided
        if ($max_price = $request->get_param('max_price')) {
            $args['meta_query'][] = [
                'key'     => 'price_max',
                'value'   => $max_price,
                'type'    => 'NUMERIC',
                'compare' => '<=',
            ];
        }

        // Execute the query to fetch hotels
        $query = new WP_Query($args);
        $hotels = [];

        // Check if any hotels were found and format the response
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $formatted_hotel = $this->format_hotel_response(get_the_ID());
                if (is_wp_error($formatted_hotel)) {
                    // Log the error for debugging purposes
                    error_log($formatted_hotel->get_error_message());
                    continue;
                }
                $hotels[] = $formatted_hotel;
            }
        } else {
            // Return a 404 response if no hotels were found
            return new WP_REST_Response(['message' => 'No hotels found'], 404);
        }

        wp_reset_postdata();

        // Return the list of hotels in the response
        return new WP_REST_Response($hotels, 200);
    }

    /**
     * Handles the request to get a single hotel by ID.
     *
     * This method processes the REST API request to retrieve a single hotel by its ID. It validates the ID,
     * checks if the post type is correct, and returns the hotel's data if found. It also handles errors and
     * logs them if the hotel is not found or if other issues arise.
     *
     * @param WP_REST_Request $request The request object containing the hotel ID.
     * @return WP_REST_Response The response object containing the hotel's data or an error message.
     */
    public function get_hotel_by_id(WP_REST_Request $request): WP_REST_Response {
        $id = (int) $request['id'];

        // Validate the post type for the given ID
        if (get_post_type($id) !== 'reisetopia_hotel') {
            $error_message = "Invalid post type for ID {$id}. Expected 'reisetopia_hotel'.";
            error_log($error_message);
            return new WP_REST_Response(['message' => 'Hotel not found'], 404);
        }

        // Get and format the hotel data
        $hotel = $this->format_hotel_response($id);

        // Handle errors during formatting
        if (is_wp_error($hotel)) {
            error_log($hotel->get_error_message());
            return new WP_REST_Response(['message' => $hotel->get_error_message()], 404);
        }

        // Return a 404 response if the hotel is not found
        if (empty($hotel)) {
            $error_message = "Hotel not found for ID {$id}.";
            error_log($error_message);
            return new WP_REST_Response(['message' => 'Hotel not found'], 404);
        }

        // Return the hotel's data in the response
        return new WP_REST_Response($hotel, 200);
    }

    /**
     * Formats the hotel data for the response.
     *
     * This method retrieves and formats the necessary hotel data to be returned to the API response.
     * It checks for the existence of the title, location (city and country), and price range, and logs
     * errors if any of these fields are missing. The formatted data is returned as an associative array.
     *
     * @param int $id The ID of the hotel post.
     * @return array|WP_Error The formatted hotel data or a WP_Error object if any required data is missing.
     */
    private function format_hotel_response(int $id): array|WP_Error {
        // Get the hotel title and check if it's valid
        $title = get_the_title($id);
        if (empty($title)) {
            return new WP_Error('no_title', "No title found for hotel ID {$id}.");
        }

        // Get the city and country fields and check if they are valid
        $city = get_field('city', $id);
        $country = get_field('country', $id);
        if (empty($city) && empty($country)) {
            return new WP_Error('no_location', "No location (city or country) found for hotel ID {$id}.");
        }

        // Get the price range and check if it's valid
        $price_min = (int) get_field('price_min', $id);
        $price_max = (int) get_field('price_max', $id);
        if ($price_min === 0 && $price_max === 0) {
            return new WP_Error('no_price', "No price range found for hotel ID {$id}.");
        }

        // Format the hotel data for the response
        $hotel_data = [
            'id' => $id,
            'title' => $title,
            'city' => $city,
            'country' => $country,
            'priceRange' => [
                'min' => $price_min,
                'max' => $price_max,
            ],
        ];

        // Get the rating and include it in the response if available
        $rating = get_field('rating', $id);
        if (!empty($rating)) {
            $hotel_data['rating'] = (float) $rating;
        } else {
            error_log("Rating not found for hotel ID {$id}.");
        }

        return $hotel_data;
    }
}
