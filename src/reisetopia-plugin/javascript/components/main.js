import { fetchHotelsRestApi } from './api.js';
import { onEndpointChange, onInputChange } from './events.js';

const $ = jQuery.noConflict();

$(document).ready(function () {
    // Default API load
    fetchHotelsRestApi();

    // Initialize event listeners
    $('#js-endpoint-select').on('change', onEndpointChange);
    $('#js-sort-order').on('change', onEndpointChange);
    $('#js-sort-attribute').on('change', onEndpointChange);
    $('#js-filter-name, #js-filter-location').on('input', onInputChange);
});
