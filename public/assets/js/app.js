/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/reisetopia-plugin/javascript/components/api.js":
/*!************************************************************!*\
  !*** ./src/reisetopia-plugin/javascript/components/api.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchHotelsAjax": function() { return /* binding */ fetchHotelsAjax; },
/* harmony export */   "fetchHotelsRestApi": function() { return /* binding */ fetchHotelsRestApi; },
/* harmony export */   "updateHotelsApi": function() { return /* binding */ updateHotelsApi; }
/* harmony export */ });
/* harmony import */ var _renderHotelItem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderHotelItem.js */ "./src/reisetopia-plugin/javascript/components/renderHotelItem.js");

const $ = jQuery.noConflict();

/**
 * Fetches hotels using the REST API and applies the given filters.
 *
 * @param {Object} filters - The filters to apply (e.g., name, location).
 */
const fetchHotelsRestApi = (filters = {}) => {
  const url = new URL(reisetopiaHotels.rest_url); // Create a new URL object for the REST API endpoint

  // Apply filters by adding them as query parameters to the URL
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value) {
      url.searchParams.append(key, value);
    }
  });

  // Fetch data from the REST API
  fetch(url.toString()).then(response => response.json()) // Parse the JSON response
  .then(data => {
    const $hotelsList = $('#js-hotels-list'); // Select the hotel list element
    $hotelsList.empty(); // Clear any existing hotel items

    if (!data || !Array.isArray(data) || data.length === 0) {
      $hotelsList.html('<p>No hotels found</p>');
    } else {
      // Render each hotel item and append it to the list
      data.forEach(hotel => {
        const hotelItem = (0,_renderHotelItem_js__WEBPACK_IMPORTED_MODULE_0__.renderHotelItem)(hotel);
        $hotelsList.append(hotelItem);
      });
    }
  }).catch(error => {
    console.error('Error fetching hotels:', error);
  });
};

/**
 * Fetches hotels using an AJAX request and applies the given filters.
 *
 * @param {Object} filters - The filters to apply (e.g., name, location).
 */
const fetchHotelsAjax = (filters = {}) => {
  const url = new URL(reisetopiaHotels.ajax_url); // Create a new URL object for the AJAX endpoint

  // Add the action parameter required for the AJAX handler
  url.searchParams.append('action', 'reisetopia_hotels_get_all');

  // Make the AJAX request using jQuery
  $.ajax({
    url: url.toString(),
    method: 'POST',
    dataType: 'json',
    // Expect JSON data in response
    data: {
      nonce: reisetopiaHotelsNonce,
      // Include the nonce for security
      ...filters // Include the filters in the request data
    },
    success: function (data) {
      const $hotelsList = $('#js-hotels-list'); // Select the hotel list element
      $hotelsList.empty(); // Clear any existing hotel items

      if (data.success && data.data.length === 0) {
        // Display a message if no hotels are found
        $hotelsList.html('<p>No hotels found</p>');
      } else if (data.success) {
        // Render each hotel item and append it to the list
        data.data.forEach(hotel => {
          const hotelItem = (0,_renderHotelItem_js__WEBPACK_IMPORTED_MODULE_0__.renderHotelItem)(hotel);
          $hotelsList.append(hotelItem);
        });
      } else {
        $hotelsList.html('<p>Error fetching hotels</p>');
      }
    },
    error: function (xhr, status, error) {
      console.error('Error fetching hotels:', error);
    }
  });
};

/**
 * Updates the list of hotels based on the selected API endpoint and applied filters.
 */
const updateHotelsApi = () => {
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

/***/ }),

/***/ "./src/reisetopia-plugin/javascript/components/events.js":
/*!***************************************************************!*\
  !*** ./src/reisetopia-plugin/javascript/components/events.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onEndpointChange": function() { return /* binding */ onEndpointChange; },
/* harmony export */   "onInputChange": function() { return /* binding */ onInputChange; }
/* harmony export */ });
/* harmony import */ var _api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api.js */ "./src/reisetopia-plugin/javascript/components/api.js");


/**
 * Creates a debounced function that delays the execution of the given function
 * until after the specified wait time has elapsed since the last time it was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @return {Function} The debounced function.
 */
function debounce(func, wait) {
  let timeout;

  // Return a new function that can be called multiple times but will only
  // execute the provided function after the specified delay.
  return function (...args) {
    clearTimeout(timeout); // Clear the previous timeout, if any
    timeout = setTimeout(() => func.apply(this, args), wait); // Set a new timeout
  };
}

// Create a debounced version of the updateHotelsApi function with a 300ms delay
const debouncedUpdateHotelsApi = debounce(_api_js__WEBPACK_IMPORTED_MODULE_0__.updateHotelsApi, 300);

/**
 * Handler for when the API endpoint selection changes.
 * It triggers the debounced updateHotelsApi function.
 */
const onEndpointChange = () => {
  debouncedUpdateHotelsApi(); // Call the debounced function to update hotels
};

/**
 * Handler for when any filter input (e.g., name or location) changes.
 * It triggers the debounced updateHotelsApi function.
 */
const onInputChange = () => {
  debouncedUpdateHotelsApi(); // Call the debounced function to update hotels
};

/***/ }),

/***/ "./src/reisetopia-plugin/javascript/components/main.js":
/*!*************************************************************!*\
  !*** ./src/reisetopia-plugin/javascript/components/main.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api.js */ "./src/reisetopia-plugin/javascript/components/api.js");
/* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./events.js */ "./src/reisetopia-plugin/javascript/components/events.js");


const $ = jQuery.noConflict();
$(document).ready(function () {
  // Default API load
  (0,_api_js__WEBPACK_IMPORTED_MODULE_0__.fetchHotelsRestApi)();

  // Initialize event listeners
  $('#js-endpoint-select').on('change', _events_js__WEBPACK_IMPORTED_MODULE_1__.onEndpointChange);
  $('#js-sort-order').on('change', _events_js__WEBPACK_IMPORTED_MODULE_1__.onEndpointChange);
  $('#js-sort-attribute').on('change', _events_js__WEBPACK_IMPORTED_MODULE_1__.onEndpointChange);
  $('#js-filter-name, #js-filter-location').on('input', _events_js__WEBPACK_IMPORTED_MODULE_1__.onInputChange);
});

/***/ }),

/***/ "./src/reisetopia-plugin/javascript/components/renderHotelItem.js":
/*!************************************************************************!*\
  !*** ./src/reisetopia-plugin/javascript/components/renderHotelItem.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderHotelItem": function() { return /* binding */ renderHotelItem; }
/* harmony export */ });
const renderHotelItem = hotel => {
  return `
        <div class="ra-hotels-list__item">
            <h5>${hotel.title}</h5>
            <p><span>Location:</span> ${hotel.country}, ${hotel.city}</p>
            <p><span>Price Range:</span> ${hotel['priceRange'].min}, ${hotel['priceRange'].max}</p>
            ${hotel.rating ? `<p><span>Rating:</span> ${hotel.rating}/5</p>` : ''}
        </div>
    `;
};

/***/ }),

/***/ "./src/reisetopia-plugin/scss/app.scss":
/*!*********************************************!*\
  !*** ./src/reisetopia-plugin/scss/app.scss ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*************************************************!*\
  !*** ./src/reisetopia-plugin/javascript/app.js ***!
  \*************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_app_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/app.scss */ "./src/reisetopia-plugin/scss/app.scss");
/* harmony import */ var _components_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/main */ "./src/reisetopia-plugin/javascript/components/main.js");
/** Styles */


// eslint-disable-next-line no-undef,no-unused-vars


}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQSw4Q0FBOEM7Ozs7O1dDQTlDO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05BO0FBQzBCOztBQUUxQiIsInNvdXJjZXMiOlsid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luLy4vc3JjL3JlaXNldG9waWEtcGx1Z2luL2phdmFzY3JpcHQvY29tcG9uZW50cy9hcGkuanMiLCJ3ZWJwYWNrOi8vcmVpc2V0b3BpYS1wbHVnaW4vLi9zcmMvcmVpc2V0b3BpYS1wbHVnaW4vamF2YXNjcmlwdC9jb21wb25lbnRzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9yZWlzZXRvcGlhLXBsdWdpbi8uL3NyYy9yZWlzZXRvcGlhLXBsdWdpbi9qYXZhc2NyaXB0L2NvbXBvbmVudHMvbWFpbi5qcyIsIndlYnBhY2s6Ly9yZWlzZXRvcGlhLXBsdWdpbi8uL3NyYy9yZWlzZXRvcGlhLXBsdWdpbi9qYXZhc2NyaXB0L2NvbXBvbmVudHMvcmVuZGVySG90ZWxJdGVtLmpzIiwid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luLy4vc3JjL3JlaXNldG9waWEtcGx1Z2luL3Njc3MvYXBwLnNjc3M/MzI0YiIsIndlYnBhY2s6Ly9yZWlzZXRvcGlhLXBsdWdpbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yZWlzZXRvcGlhLXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcmVpc2V0b3BpYS1wbHVnaW4vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9yZWlzZXRvcGlhLXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luLy4vc3JjL3JlaXNldG9waWEtcGx1Z2luL2phdmFzY3JpcHQvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbmRlckhvdGVsSXRlbSB9IGZyb20gJy4vcmVuZGVySG90ZWxJdGVtLmpzJztcblxuY29uc3QgJCA9IGpRdWVyeS5ub0NvbmZsaWN0KCk7XG5cbi8qKlxuICogRmV0Y2hlcyBob3RlbHMgdXNpbmcgdGhlIFJFU1QgQVBJIGFuZCBhcHBsaWVzIHRoZSBnaXZlbiBmaWx0ZXJzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWx0ZXJzIC0gVGhlIGZpbHRlcnMgdG8gYXBwbHkgKGUuZy4sIG5hbWUsIGxvY2F0aW9uKS5cbiAqL1xuZXhwb3J0IGNvbnN0IGZldGNoSG90ZWxzUmVzdEFwaSA9IChmaWx0ZXJzID0ge30pID0+IHtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlaXNldG9waWFIb3RlbHMucmVzdF91cmwpOyAvLyBDcmVhdGUgYSBuZXcgVVJMIG9iamVjdCBmb3IgdGhlIFJFU1QgQVBJIGVuZHBvaW50XG5cbiAgICAvLyBBcHBseSBmaWx0ZXJzIGJ5IGFkZGluZyB0aGVtIGFzIHF1ZXJ5IHBhcmFtZXRlcnMgdG8gdGhlIFVSTFxuICAgIE9iamVjdC5rZXlzKGZpbHRlcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBmaWx0ZXJzW2tleV07XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEZldGNoIGRhdGEgZnJvbSB0aGUgUkVTVCBBUElcbiAgICBmZXRjaCh1cmwudG9TdHJpbmcoKSlcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKSAvLyBQYXJzZSB0aGUgSlNPTiByZXNwb25zZVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRob3RlbHNMaXN0ID0gJCgnI2pzLWhvdGVscy1saXN0Jyk7IC8vIFNlbGVjdCB0aGUgaG90ZWwgbGlzdCBlbGVtZW50XG4gICAgICAgICAgICAkaG90ZWxzTGlzdC5lbXB0eSgpOyAvLyBDbGVhciBhbnkgZXhpc3RpbmcgaG90ZWwgaXRlbXNcblxuICAgICAgICAgICAgaWYgKCFkYXRhIHx8ICFBcnJheS5pc0FycmF5KGRhdGEpIHx8IGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJGhvdGVsc0xpc3QuaHRtbCgnPHA+Tm8gaG90ZWxzIGZvdW5kPC9wPicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBSZW5kZXIgZWFjaCBob3RlbCBpdGVtIGFuZCBhcHBlbmQgaXQgdG8gdGhlIGxpc3RcbiAgICAgICAgICAgICAgICBkYXRhLmZvckVhY2goaG90ZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBob3RlbEl0ZW0gPSByZW5kZXJIb3RlbEl0ZW0oaG90ZWwpO1xuICAgICAgICAgICAgICAgICAgICAkaG90ZWxzTGlzdC5hcHBlbmQoaG90ZWxJdGVtKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIGhvdGVsczonLCBlcnJvcik7XG4gICAgICAgIH0pO1xufTtcblxuLyoqXG4gKiBGZXRjaGVzIGhvdGVscyB1c2luZyBhbiBBSkFYIHJlcXVlc3QgYW5kIGFwcGxpZXMgdGhlIGdpdmVuIGZpbHRlcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGZpbHRlcnMgLSBUaGUgZmlsdGVycyB0byBhcHBseSAoZS5nLiwgbmFtZSwgbG9jYXRpb24pLlxuICovXG5leHBvcnQgY29uc3QgZmV0Y2hIb3RlbHNBamF4ID0gKGZpbHRlcnMgPSB7fSkgPT4ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVpc2V0b3BpYUhvdGVscy5hamF4X3VybCk7IC8vIENyZWF0ZSBhIG5ldyBVUkwgb2JqZWN0IGZvciB0aGUgQUpBWCBlbmRwb2ludFxuXG4gICAgLy8gQWRkIHRoZSBhY3Rpb24gcGFyYW1ldGVyIHJlcXVpcmVkIGZvciB0aGUgQUpBWCBoYW5kbGVyXG4gICAgdXJsLnNlYXJjaFBhcmFtcy5hcHBlbmQoJ2FjdGlvbicsICdyZWlzZXRvcGlhX2hvdGVsc19nZXRfYWxsJyk7XG5cbiAgICAvLyBNYWtlIHRoZSBBSkFYIHJlcXVlc3QgdXNpbmcgalF1ZXJ5XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB1cmwudG9TdHJpbmcoKSxcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsIC8vIEV4cGVjdCBKU09OIGRhdGEgaW4gcmVzcG9uc2VcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgbm9uY2U6IHJlaXNldG9waWFIb3RlbHNOb25jZSwgLy8gSW5jbHVkZSB0aGUgbm9uY2UgZm9yIHNlY3VyaXR5XG4gICAgICAgICAgICAuLi5maWx0ZXJzIC8vIEluY2x1ZGUgdGhlIGZpbHRlcnMgaW4gdGhlIHJlcXVlc3QgZGF0YVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCAkaG90ZWxzTGlzdCA9ICQoJyNqcy1ob3RlbHMtbGlzdCcpOyAvLyBTZWxlY3QgdGhlIGhvdGVsIGxpc3QgZWxlbWVudFxuICAgICAgICAgICAgJGhvdGVsc0xpc3QuZW1wdHkoKTsgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIGhvdGVsIGl0ZW1zXG5cbiAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgJiYgZGF0YS5kYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgYSBtZXNzYWdlIGlmIG5vIGhvdGVscyBhcmUgZm91bmRcbiAgICAgICAgICAgICAgICAkaG90ZWxzTGlzdC5odG1sKCc8cD5ObyBob3RlbHMgZm91bmQ8L3A+Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIC8vIFJlbmRlciBlYWNoIGhvdGVsIGl0ZW0gYW5kIGFwcGVuZCBpdCB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGRhdGEuZGF0YS5mb3JFYWNoKGhvdGVsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaG90ZWxJdGVtID0gcmVuZGVySG90ZWxJdGVtKGhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgJGhvdGVsc0xpc3QuYXBwZW5kKGhvdGVsSXRlbSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRob3RlbHNMaXN0Lmh0bWwoJzxwPkVycm9yIGZldGNoaW5nIGhvdGVsczwvcD4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgaG90ZWxzOicsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBsaXN0IG9mIGhvdGVscyBiYXNlZCBvbiB0aGUgc2VsZWN0ZWQgQVBJIGVuZHBvaW50IGFuZCBhcHBsaWVkIGZpbHRlcnMuXG4gKi9cbmV4cG9ydCBjb25zdCB1cGRhdGVIb3RlbHNBcGkgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0ZWRFbmRwb2ludCA9ICQoJyNqcy1lbmRwb2ludC1zZWxlY3QnKS52YWwoKTsgLy8gR2V0IHRoZSBzZWxlY3RlZCBBUEkgZW5kcG9pbnQgKFJFU1Qgb3IgQUpBWClcbiAgICBjb25zdCBmaWx0ZXJzID0ge1xuICAgICAgICBuYW1lOiAkKCcjanMtZmlsdGVyLW5hbWUnKS52YWwoKSxcbiAgICAgICAgbG9jYXRpb246ICQoJyNqcy1maWx0ZXItbG9jYXRpb24nKS52YWwoKSxcbiAgICAgICAgbWF4X3ByaWNlOiAkKCcjanMtZmlsdGVyLW1heC1wcmljZScpLnZhbCgpLFxuICAgICAgICBzb3J0X2F0dHJpYnV0ZTogJCgnI2pzLXNvcnQtYXR0cmlidXRlJykudmFsKCksXG4gICAgICAgIHNvcnRfb3JkZXI6ICQoJyNqcy1zb3J0LW9yZGVyJykudmFsKClcbiAgICB9O1xuXG4gICAgLy8gQ2xlYXIgdGhlIGhvdGVsIGxpc3QgYmVmb3JlIGZldGNoaW5nIG5ldyBkYXRhXG4gICAgY29uc3QgJGhvdGVsc0xpc3QgPSAkKCcjanMtaG90ZWxzLWxpc3QnKTtcbiAgICAkaG90ZWxzTGlzdC5lbXB0eSgpO1xuXG4gICAgLy8gRmV0Y2ggaG90ZWxzIGJhc2VkIG9uIHRoZSBzZWxlY3RlZCBBUEkgZW5kcG9pbnRcbiAgICBpZiAoc2VsZWN0ZWRFbmRwb2ludCA9PT0gJ3Jlc3QnKSB7XG4gICAgICAgIGZldGNoSG90ZWxzUmVzdEFwaShmaWx0ZXJzKTtcbiAgICB9IGVsc2UgaWYgKHNlbGVjdGVkRW5kcG9pbnQgPT09ICdhamF4Jykge1xuICAgICAgICBmZXRjaEhvdGVsc0FqYXgoZmlsdGVycyk7XG4gICAgfVxufTtcbiIsImltcG9ydCB7IHVwZGF0ZUhvdGVsc0FwaSB9IGZyb20gJy4vYXBpLmpzJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIHRoZSBleGVjdXRpb24gb2YgdGhlIGdpdmVuIGZ1bmN0aW9uXG4gKiB1bnRpbCBhZnRlciB0aGUgc3BlY2lmaWVkIHdhaXQgdGltZSBoYXMgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIGl0IHdhcyBpbnZva2VkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgLSBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gd2FpdCAtIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQpIHtcbiAgICBsZXQgdGltZW91dDtcblxuICAgIC8vIFJldHVybiBhIG5ldyBmdW5jdGlvbiB0aGF0IGNhbiBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMgYnV0IHdpbGwgb25seVxuICAgIC8vIGV4ZWN1dGUgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIGFmdGVyIHRoZSBzcGVjaWZpZWQgZGVsYXkuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpOyAvLyBDbGVhciB0aGUgcHJldmlvdXMgdGltZW91dCwgaWYgYW55XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IGZ1bmMuYXBwbHkodGhpcywgYXJncyksIHdhaXQpOyAvLyBTZXQgYSBuZXcgdGltZW91dFxuICAgIH07XG59XG5cbi8vIENyZWF0ZSBhIGRlYm91bmNlZCB2ZXJzaW9uIG9mIHRoZSB1cGRhdGVIb3RlbHNBcGkgZnVuY3Rpb24gd2l0aCBhIDMwMG1zIGRlbGF5XG5jb25zdCBkZWJvdW5jZWRVcGRhdGVIb3RlbHNBcGkgPSBkZWJvdW5jZSh1cGRhdGVIb3RlbHNBcGksIDMwMCk7XG5cbi8qKlxuICogSGFuZGxlciBmb3Igd2hlbiB0aGUgQVBJIGVuZHBvaW50IHNlbGVjdGlvbiBjaGFuZ2VzLlxuICogSXQgdHJpZ2dlcnMgdGhlIGRlYm91bmNlZCB1cGRhdGVIb3RlbHNBcGkgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBjb25zdCBvbkVuZHBvaW50Q2hhbmdlID0gKCkgPT4ge1xuICAgIGRlYm91bmNlZFVwZGF0ZUhvdGVsc0FwaSgpOyAvLyBDYWxsIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gdG8gdXBkYXRlIGhvdGVsc1xufTtcblxuLyoqXG4gKiBIYW5kbGVyIGZvciB3aGVuIGFueSBmaWx0ZXIgaW5wdXQgKGUuZy4sIG5hbWUgb3IgbG9jYXRpb24pIGNoYW5nZXMuXG4gKiBJdCB0cmlnZ2VycyB0aGUgZGVib3VuY2VkIHVwZGF0ZUhvdGVsc0FwaSBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGNvbnN0IG9uSW5wdXRDaGFuZ2UgPSAoKSA9PiB7XG4gICAgZGVib3VuY2VkVXBkYXRlSG90ZWxzQXBpKCk7IC8vIENhbGwgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB0byB1cGRhdGUgaG90ZWxzXG59O1xuIiwiaW1wb3J0IHsgZmV0Y2hIb3RlbHNSZXN0QXBpIH0gZnJvbSAnLi9hcGkuanMnO1xuaW1wb3J0IHsgb25FbmRwb2ludENoYW5nZSwgb25JbnB1dENoYW5nZSB9IGZyb20gJy4vZXZlbnRzLmpzJztcblxuY29uc3QgJCA9IGpRdWVyeS5ub0NvbmZsaWN0KCk7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAvLyBEZWZhdWx0IEFQSSBsb2FkXG4gICAgZmV0Y2hIb3RlbHNSZXN0QXBpKCk7XG5cbiAgICAvLyBJbml0aWFsaXplIGV2ZW50IGxpc3RlbmVyc1xuICAgICQoJyNqcy1lbmRwb2ludC1zZWxlY3QnKS5vbignY2hhbmdlJywgb25FbmRwb2ludENoYW5nZSk7XG4gICAgJCgnI2pzLXNvcnQtb3JkZXInKS5vbignY2hhbmdlJywgb25FbmRwb2ludENoYW5nZSk7XG4gICAgJCgnI2pzLXNvcnQtYXR0cmlidXRlJykub24oJ2NoYW5nZScsIG9uRW5kcG9pbnRDaGFuZ2UpO1xuICAgICQoJyNqcy1maWx0ZXItbmFtZSwgI2pzLWZpbHRlci1sb2NhdGlvbicpLm9uKCdpbnB1dCcsIG9uSW5wdXRDaGFuZ2UpO1xufSk7XG4iLCJleHBvcnQgY29uc3QgcmVuZGVySG90ZWxJdGVtID0gKGhvdGVsKSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInJhLWhvdGVscy1saXN0X19pdGVtXCI+XG4gICAgICAgICAgICA8aDU+JHtob3RlbC50aXRsZX08L2g1PlxuICAgICAgICAgICAgPHA+PHNwYW4+TG9jYXRpb246PC9zcGFuPiAke2hvdGVsLmNvdW50cnl9LCAke2hvdGVsLmNpdHl9PC9wPlxuICAgICAgICAgICAgPHA+PHNwYW4+UHJpY2UgUmFuZ2U6PC9zcGFuPiAke2hvdGVsWydwcmljZVJhbmdlJ10ubWlufSwgJHtob3RlbFsncHJpY2VSYW5nZSddLm1heH08L3A+XG4gICAgICAgICAgICAke2hvdGVsLnJhdGluZyA/IGA8cD48c3Bhbj5SYXRpbmc6PC9zcGFuPiAke2hvdGVsLnJhdGluZ30vNTwvcD5gIDogJyd9XG4gICAgICAgIDwvZGl2PlxuICAgIGA7XG59O1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyoqIFN0eWxlcyAqL1xuaW1wb3J0ICcuLi9zY3NzL2FwcC5zY3NzJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmLG5vLXVudXNlZC12YXJzXG5cbmltcG9ydCAnLi9jb21wb25lbnRzL21haW4nO1xuXG4iXSwibmFtZXMiOlsicmVuZGVySG90ZWxJdGVtIiwiJCIsImpRdWVyeSIsIm5vQ29uZmxpY3QiLCJmZXRjaEhvdGVsc1Jlc3RBcGkiLCJmaWx0ZXJzIiwidXJsIiwiVVJMIiwicmVpc2V0b3BpYUhvdGVscyIsInJlc3RfdXJsIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJ2YWx1ZSIsInNlYXJjaFBhcmFtcyIsImFwcGVuZCIsImZldGNoIiwidG9TdHJpbmciLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiZGF0YSIsIiRob3RlbHNMaXN0IiwiZW1wdHkiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJodG1sIiwiaG90ZWwiLCJob3RlbEl0ZW0iLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsImZldGNoSG90ZWxzQWpheCIsImFqYXhfdXJsIiwiYWpheCIsIm1ldGhvZCIsImRhdGFUeXBlIiwibm9uY2UiLCJyZWlzZXRvcGlhSG90ZWxzTm9uY2UiLCJzdWNjZXNzIiwieGhyIiwic3RhdHVzIiwidXBkYXRlSG90ZWxzQXBpIiwic2VsZWN0ZWRFbmRwb2ludCIsInZhbCIsIm5hbWUiLCJsb2NhdGlvbiIsIm1heF9wcmljZSIsInNvcnRfYXR0cmlidXRlIiwic29ydF9vcmRlciIsImRlYm91bmNlIiwiZnVuYyIsIndhaXQiLCJ0aW1lb3V0IiwiYXJncyIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJhcHBseSIsImRlYm91bmNlZFVwZGF0ZUhvdGVsc0FwaSIsIm9uRW5kcG9pbnRDaGFuZ2UiLCJvbklucHV0Q2hhbmdlIiwiZG9jdW1lbnQiLCJyZWFkeSIsIm9uIiwidGl0bGUiLCJjb3VudHJ5IiwiY2l0eSIsIm1pbiIsIm1heCIsInJhdGluZyJdLCJzb3VyY2VSb290IjoiIn0=