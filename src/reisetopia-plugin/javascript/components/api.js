import { renderHotelItem } from './renderHotelItem.js';

const $ = jQuery.noConflict();

export const fetchHotelsRestApi = (filters = {}) => {
    const url = new URL(reisetopiaHotels.rest_url);

    // Apply filters
    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value) {
            url.searchParams.append(key, value);
        }
    });

    fetch(url.toString())
        .then(response => response.json())
        .then(data => {
            const $hotelsList = $('#js-hotels-list');
            $hotelsList.empty();
            if (!data || !Array.isArray(data) || data.length === 0) {
                $hotelsList.html('<p>No hotels found</p>');
            } else {
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

export const fetchHotelsAjax = (filters = {}) => {
    const url = new URL(reisetopiaHotels.ajax_url);

    // Add action parameter for AJAX handler
    url.searchParams.append('action', 'reisetopia_hotels_get_all');

    // Make the AJAX request
    $.ajax({
        url: url.toString(),
        method: 'POST',
        dataType: 'json',
        data: {
            nonce: reisetopiaHotelsNonce,
            ...filters // Include filters
        },
        success: function(data) {
            const $hotelsList = $('#js-hotels-list');
            $hotelsList.empty();
            if (data.success && data.data.length === 0) {
                $hotelsList.html('<p>No hotels found</p>');
            } else if (data.success) {
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

export const updateHotelsApi = () => {
    const selectedEndpoint = $('#js-endpoint-select').val();
    const filters = {
        name: $('#js-filter-name').val(),
        location: $('#js-filter-location').val()
    };

    // Clear the list before fetching new data
    const $hotelsList = $('#js-hotels-list');
    $hotelsList.empty();

    if (selectedEndpoint === 'rest') {
        fetchHotelsRestApi(filters);
    } else if (selectedEndpoint === 'ajax') {
        fetchHotelsAjax(filters);
    }
};
