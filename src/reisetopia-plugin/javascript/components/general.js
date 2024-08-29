const $ = jQuery.noConflict();

const fetchHotelsRestApi = (filters = {}) => {
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
            const $hotelsList = $('#hotels-list');
            $hotelsList.empty();
            if (data.length === 0) {
                $hotelsList.html('<p>No hotels found</p>');
            } else {
                data.forEach(hotel => {
                    const hotelItem = `
                        <div class="hotel-item">
                            <h3>${hotel.title}</h3>
                            <p><span>Location:</span>${hotel.country}, ${hotel.city}</p>
                            <p><span>Price Range:</span>${hotel['priceRange'].min}, ${hotel['priceRange'].max}</p>
                            <p><span>Rating:</span>${hotel.rating}</p>
                        </div>
                    `;
                    $hotelsList.append(hotelItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching hotels:', error);
        });
};


const fetchHotelsAjax = (filters = {}) => {
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
            const $hotelsList = $('#hotels-list');
            $hotelsList.empty();
            if (data.success && data.data.length === 0) {
                $hotelsList.html('<p>No hotels found</p>');
            } else if (data.success) {
                data.data.forEach(hotel => {
                    const hotelItem = `
                        <div class="hotel-item">
                            <h3>${hotel.title}</h3>
                            <p><span>Location:</span>${hotel.country}, ${hotel.city}</p>
                            <p><span>Price Range:</span>${hotel['priceRange'].min}, ${hotel['priceRange'].max}</p>
                            <p><span>Rating:</span>${hotel.rating}</p>
                        </div>
                    `;
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


const updateHotelsApi = () => {
    const selectedEndpoint = $('#endpoint-select').val();
    const filters = {
        name: $('#filter-name').val(),
        location: $('#filter-location').val()
    };

    // Clear the list before fetching new data
    const $hotelsList = $('#hotels-list');
    $hotelsList.empty();

    if (selectedEndpoint === 'rest') {
        fetchHotelsRestApi(filters);
    } else if (selectedEndpoint === 'ajax') {
        fetchHotelsAjax(filters);
    }
};

const onEndpointChange = () => {
    updateHotelsApi();
};

const onInputChange = () => {
    updateHotelsApi();
};

$(document).ready(function () {
    // Default load
    fetchHotelsRestApi();

    // Initialize event listeners
    $('#endpoint-select').on('change', onEndpointChange);
    $('#filter-name, #filter-location').on('input', onInputChange);
});
