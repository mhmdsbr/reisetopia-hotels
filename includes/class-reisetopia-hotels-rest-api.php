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
        $name = $request->get_param('name');
        $location = $request->get_param('location');
        $max_price = $request->get_param('max_price');
        $hotels = Reisetopia_Hotels_Manager::filter_hotels($name, $location, $max_price);

        // Check if any hotels were found and format the response
        if (empty($hotels)) {
            // Return a 404 response if no hotels were found
            return new WP_REST_Response(['message' => 'No hotels found'], 404);
        }

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
        $hotel = Reisetopia_Hotels_Manager::get_hotel_data_by_id($id);

        // Validate the post type for the given ID
        if (get_post_type($id) !== 'reisetopia_hotel') {
            $error_message = "Invalid post type for ID {$id}. Expected 'reisetopia_hotel'.";
            error_log($error_message);
            return new WP_REST_Response(['message' => 'Hotel not found'], 404);
        }

        // Handle errors during formatting
        if (empty($hotel)) {
            $error_message = "Hotel not found for ID {$id}.";
            error_log($error_message);
            return new WP_REST_Response(['message' => 'Hotel not found'], 404);
        }

        // Return the hotel's data in the response
        return new WP_REST_Response($hotel, 200);
    }
}
