<?php


/**
 * Class Reisetopia_Hotels_Query
 *
 * This class handles building and executing the query for retrieving hotel data
 * with optional filters like name, location, and maximum price.
 */
class Reisetopia_Hotels_Query {

    /**
     * The arguments for WP_Query.
     *
     * @var array
     */
    private array $args;

    /**
     * Constructor initializes the default query arguments.
     */
    public function __construct() {
        $this->args = [
            'post_type' => 'reisetopia_hotel',
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'meta_query' => [],
        ];
    }

    /**
     * Sets the name filter for the query.
     *
     * @param string $name The hotel name to filter by.
     */
    public function set_name_filter(string $name): void {
        $this->args['s'] = $name;
    }

    /**
     * Sets the location filter for the query.
     *
     * @param string $location The hotel location to filter by.
     */
    public function set_location_filter(string $location): void {
        $this->args['meta_query'][] = [
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

    /**
     * Sets the maximum price filter for the query.
     *
     * @param int $max_price The maximum price to filter by.
     */
    public function set_max_price_filter(int $max_price): void {
        $this->args['meta_query'][] = [
            'key'     => 'price_max',
            'value'   => $max_price,
            'type'    => 'NUMERIC',
            'compare' => '<=',
        ];
    }

    /**
     * Executes the query and returns the hotels.
     *
     * @return array The list of hotels found by the query.
     */
    public function get_hotels(): array {
        $query = new WP_Query($this->args);
        $hotels = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $hotels[] = $this->format_hotel_response(get_the_ID());
            }
        }

        wp_reset_postdata();

        return $hotels;
    }

    /**
     * Formats the hotel data for the response.
     *
     * @param int $id The ID of the hotel post.
     * @return array The formatted hotel data.
     */
     function format_hotel_response(int $id): array {
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
     * Sets the sorting attribute and order for the query.
     *
     * @param string $attribute The attribute to sort by ('title', 'price_min', or 'price_max').
     * @param string $order The sorting order ('ASC' or 'DESC').
     */
    public function set_sorting(string $attribute, string $order): void {
        // Map the attribute to WP_Query's 'orderby' parameter
        switch ($attribute) {
            case 'price_min':
                $this->args['orderby'] = 'meta_value_num';
                $this->args['meta_key'] = 'price_min';
                break;
            case 'price_max':
                $this->args['orderby'] = 'meta_value_num';
                $this->args['meta_key'] = 'price_max';
                break;
            case 'title':
            default:
                $this->args['orderby'] = 'title';
                break;
        }

        // Set the order (ASC or DESC)
        $this->args['order'] = $order;
    }
}
