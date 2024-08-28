<?php

/**
 * Handles the custom post types for Reisetopia Hotels.
 *
 * @link       https://reisetopia.de
 * @since      1.0.0
 *
 * @package    Reisetopia_Hotels
 * @subpackage Reisetopia_Hotels/includes
 */

/**
 * Defines the custom post types for the plugin.
 *
 * @since      1.0.0
 * @package    Reisetopia_Hotels
 * @subpackage Reisetopia_Hotels/includes
 * @author     Mohammad Saber <saaber.mohamad@gmail.com>
 */
class Reisetopia_Hotels_Cpt {

    /**
     * Register the `reisetopia_hotel` custom post type.
     *
     * @since    1.0.0
     */
    public function register_reisetopia_hotel_cpt() {
        $labels = array(
            'name'                  => _x( 'Hotels', 'Post Type General Name', 'reisetopia-hotels' ),
            'singular_name'         => _x( 'Hotel', 'Post Type Singular Name', 'reisetopia-hotels' ),
            'menu_name'             => __( 'Hotels', 'reisetopia-hotels' ),
            'name_admin_bar'        => __( 'Hotel', 'reisetopia-hotels' ),
            'archives'              => __( 'Hotel Archives', 'reisetopia-hotels' ),
            'attributes'            => __( 'Hotel Attributes', 'reisetopia-hotels' ),
            'all_items'             => __( 'All Hotels', 'reisetopia-hotels' ),
            'add_new_item'          => __( 'Add New Hotel', 'reisetopia-hotels' ),
            'add_new'               => __( 'Add New', 'reisetopia-hotels' ),
            'new_item'              => __( 'New Hotel', 'reisetopia-hotels' ),
            'edit_item'             => __( 'Edit Hotel', 'reisetopia-hotels' ),
            'update_item'           => __( 'Update Hotel', 'reisetopia-hotels' ),
            'view_item'             => __( 'View Hotel', 'reisetopia-hotels' ),
            'view_items'            => __( 'View Hotels', 'reisetopia-hotels' ),
            'search_items'          => __( 'Search Hotel', 'reisetopia-hotels' ),
            'not_found'             => __( 'Not found', 'reisetopia-hotels' ),
            'not_found_in_trash'    => __( 'Not found in Trash', 'reisetopia-hotels' ),
            'featured_image'        => __( 'Featured Image', 'reisetopia-hotels' ),
            'set_featured_image'    => __( 'Set featured image', 'reisetopia-hotels' ),
            'remove_featured_image' => __( 'Remove featured image', 'reisetopia-hotels' ),
            'use_featured_image'    => __( 'Use as featured image', 'reisetopia-hotels' ),
            'insert_into_item'      => __( 'Insert into hotel', 'reisetopia-hotels' ),
            'uploaded_to_this_item' => __( 'Uploaded to this hotel', 'reisetopia-hotels' ),
            'items_list'            => __( 'Hotels list', 'reisetopia-hotels' ),
            'items_list_navigation' => __( 'Hotels list navigation', 'reisetopia-hotels' ),
            'filter_items_list'     => __( 'Filter hotels list', 'reisetopia-hotels' ),
        );

        $args = array(
            'label'                 => __( 'Hotel', 'reisetopia-hotels' ),
            'description'           => __( 'Custom post type for Reisetopia Hotels', 'reisetopia-hotels' ),
            'labels'                => $labels,
            'supports'              => array( 'title', 'thumbnail' ),
            'hierarchical'          => false,
            'public'                => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'menu_position'         => 5,
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => true,
            'can_export'            => true,
            'has_archive'           => true,
            'exclude_from_search'   => false,
            'publicly_queryable'    => true,
            'capability_type'       => 'post',
        );

        register_post_type( 'reisetopia_hotel', $args );
    }

    /**
     * Register the ACF fields programmatically
     *
     * @since    1.0.0
     */
    public function register_reisetopia_hotels_acf_fields() {
        if( function_exists('acf_add_local_field_group') ) {
            acf_add_local_field_group(array(
                'key' => 'group_reisetopia_hotel',
                'title' => 'Hotel Details',
                'fields' => array(
                    array(
                        'key' => 'field_reisetopia_hotel_city',
                        'label' => 'City',
                        'name' => 'city',
                        'type' => 'text',
                        'instructions' => 'Enter the city where the hotel is located.',
                        'required' => 1,
                    ),
                    array(
                        'key' => 'field_reisetopia_hotel_country',
                        'label' => 'Country',
                        'name' => 'country',
                        'type' => 'text',
                        'instructions' => 'Enter the country where the hotel is located.',
                        'required' => 1,
                    ),
                    array(
                        'key' => 'field_reisetopia_hotel_price_max',
                        'label' => 'Price Range (Max)',
                        'name' => 'price_max',
                        'type' => 'number',
                        'instructions' => 'Enter the maximum price range.',
                        'required' => 1,
                        'min' => 0,
                    ),
                    array(
                        'key' => 'field_reisetopia_hotel_price_min',
                        'label' => 'Price Range (Min)',
                        'name' => 'price_min',
                        'type' => 'number',
                        'instructions' => 'Enter the minimum price range.',
                        'required' => 1,
                        'min' => 0,
                    ),
                    array(
                        'key' => 'field_reisetopia_hotel_rating',
                        'label' => 'Rating',
                        'name' => 'rating',
                        'type' => 'number',
                        'instructions' => 'Enter the hotel rating (optional).',
                        'required' => 0,
                        'min' => 0,
                        'max' => 5,
                        'step' => '0.1',
                    ),
                ),
                'location' => array(
                    array(
                        array(
                            'param' => 'post_type',
                            'operator' => '==',
                            'value' => 'reisetopia_hotel',
                        ),
                    ),
                ),
                'menu_order' => 0,
                'position' => 'normal',
                'style' => 'default',
                'label_placement' => 'top',
                'instruction_placement' => 'label',
                'hide_on_screen' => '',
            ));
        }
    }

}



