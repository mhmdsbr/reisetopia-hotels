import { renderHotelItem } from './renderHotelItem.js';

const $ = jQuery.noConflict();

/**
 * Fetches hotels using the REST API and applies the given filters.
 *
 * @param {Object} filters - The filters to apply (e.g., name, location).
 */
export const fetchHotelsRestApi = (filters = {}) => {
    const url = new URL(reisetopiaHotels.rest_url); // Create a new URL object for the REST API endpoint

    // Apply filters by adding them as query parameters to the URL
    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value) {
            url.searchParams.append(key, value);
        }
    });

    // Fetch data from the REST API
    fetch(url.toString())
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            const $hotelsList = $('#js-hotels-list'); // Select the hotel list element
            $hotelsList.empty(); // Clear any existing hotel items

            if (!data || !Array.isArray(data) || data.length === 0) {
                $hotelsList.html('<p>No hotels found</p>');
            } else {
                // Render each hotel item and append it to the list
                data.forEach(hotel => {
                    const hotelItem = renderHotelItem(hotel);
                    $hotelsList.append(hotelItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching hotels:', error);
        });
};

/**
 * Fetches hotels using an AJAX request and applies the given filters.
 *
 * @param {Object} filters - The filters to apply (e.g., name, location).
 */
export const fetchHotelsAjax = (filters = {}) => {
    const url = new URL(reisetopiaHotels.ajax_url); // Create a new URL object for the AJAX endpoint

    // Add the action parameter required for the AJAX handler
    url.searchParams.append('action', 'reisetopia_hotels_get_all');

    // Make the AJAX request using jQuery
    $.ajax({
        url: url.toString(),
        method: 'POST',
        dataType: 'json', // Expect JSON data in response
        data: {
            nonce: reisetopiaHotelsNonce, // Include the nonce for security
            ...filters // Include the filters in the request data
        },
        success: function(data) {
            const $hotelsList = $('#js-hotels-list'); // Select the hotel list element
            $hotelsList.empty(); // Clear any existing hotel items

            if (data.success && data.data.length === 0) {
                // Display a message if no hotels are found
                $hotelsList.html('<p>No hotels found</p>');
            } else if (data.success) {
                // Render each hotel item and append it to the list
                data.data.forEach(hotel => {
                    const hotelItem = renderHotelItem(hotel);
                    $hotelsList.append(hotelItem);
                });
            } else {
                $hotelsList.html('<p>Error fetching hotels</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching hotels:', error);
        }
    });
};

/**
 * Updates the list of hotels based on the selected API endpoint and applied filters.
 */
export const updateHotelsApi = () => {
    const selectedEndpoint = $('#js-endpoint-select').val(); // Get the selected API endpoint (REST or AJAX)
    const filters = {
        name: $('#js-filter-name').val(),
        location: $('#js-filter-location').val(),
        max_price: $('#js-filter-max-price').val(),
        sort_attribute: $('#js-sort-attribute').val(),
        sort_order: $('#js-sort-order').val()
    };

    // Clear the hotel list before fetching new data
    const $hotelsList = $('#js-hotels-list');
    $hotelsList.empty();

    // Fetch hotels based on the selected API endpoint
    if (selectedEndpoint === 'rest') {
        fetchHotelsRestApi(filters);
    } else if (selectedEndpoint === 'ajax') {
        fetchHotelsAjax(filters);
    }
};
