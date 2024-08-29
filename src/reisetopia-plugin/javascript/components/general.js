const $ = jQuery.noConflict();


$(document).ready(function () {
    $.ajax({
        url: reisetopiaHotelsAjax.ajaxurl,
        type: 'POST',
        data: {
            action: 'reisetopia_hotels_get_all',
            nonce: reisetopiaHotelsNonce,
            location: 'Berlin',
        },
        success: function(response) {
            console.log('AJAX Response:', response);
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', status, error);
        }
    });
});
