<?php

class Reisetopia_Hotels_Manager {

    /**
     * Get all hotels without any filters.
     *
     * @return array An array of all hotels.
     */
    public static function get_all_hotels(): array
    {
        // Call the filter_hotels method with empty strings to retrieve all hotels
        return self::filter_hotels('', '', '');
    }

    /**
     * Get detailed information about a specific hotel by its ID.
     *
     * @param int $id The ID of the hotel.
     * @return array An array containing hotel data.
     */
    public static function get_hotel_data_by_id(int $id): array
    {
        $hotel_data = [];

        // Retrieve the hotel post by its ID
        $hotel = get_post($id);

        if ($hotel) {
            // Populate the hotel data array with relevant fields
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
        }
        // Return the hotel data array
        return $hotel_data;
    }

    /**
     * Filter hotels based on name, location, and maximum price.
     *
     * @param empty|string $name The name filter for the hotels.
     * @param string $location The location filter for the hotels.
     * @param int|string $max_price The maximum price filter for the hotels.
     * @return array An array of hotels matching the filters.
     */
    public static function filter_hotels(string $name, string $location, int|string $max_price): array
    {
        // Create a new instance of Reisetopia_Hotels_Query for filtering hotels
        $hotel_query = new Reisetopia_Hotels_Query();

        // Apply the name filter if a name is provided
        if (!empty($name)) {
            $hotel_query->set_name_filter($name);
        }
        // Apply the location filter if a location is provided
        if (!empty($location)) {
            $hotel_query->set_location_filter($location);
        }
        // Apply the maximum price filter if a max price is provided
        if (!empty($max_price)) {
            $hotel_query->set_max_price_filter($max_price);
        }

        return $hotel_query->get_hotels();
    }
}
