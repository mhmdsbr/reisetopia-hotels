<?php


class Reisetopia_Hotels_Manager {

    public function __construct() {

    }

    public static function get_all_hotels(): array
    {
        return self::filter_hotels('','','');
    }

    public static function get_hotel_data_by_id($id): array
    {
        $hotel_data = [];
        $hotel = get_post($id);
        if ($hotel) {
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
        return $hotel_data;
    }

    public static function filter_hotels($name, $location, $max_price): array
    {
        $hotel_query = new Reisetopia_Hotels_Query();

        if (!empty($name)) {
            $hotel_query->set_name_filter($name);
        }
        if (!empty($location)) {
            $hotel_query->set_location_filter($location);
        }
        if (!empty($max_price)) {
            $hotel_query->set_max_price_filter($max_price);
        }

        return $hotel_query->get_hotels();

    }
}
