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
    max_price: undefined
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsQ0FBQytELEVBQUUsQ0FBQyxRQUFRLEVBQUVKLHdEQUFnQixDQUFDO0VBQ3ZEM0QsQ0FBQyxDQUFDLHNDQUFzQyxDQUFDLENBQUMrRCxFQUFFLENBQUMsT0FBTyxFQUFFSCxxREFBYSxDQUFDO0FBQ3hFLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNaSyxNQUFNN0QsZUFBZSxHQUFJNkIsS0FBSyxJQUFLO0VBQ3RDLE9BQU87QUFDWDtBQUNBLGtCQUFrQkEsS0FBSyxDQUFDb0MsS0FBSztBQUM3Qix3Q0FBd0NwQyxLQUFLLENBQUNxQyxPQUFPLEtBQUtyQyxLQUFLLENBQUNzQyxJQUFJO0FBQ3BFLDJDQUEyQ3RDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQ3VDLEdBQUcsS0FBS3ZDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQ3dDLEdBQUc7QUFDOUYsY0FBY3hDLEtBQUssQ0FBQ3lDLE1BQU0sR0FBRywyQkFBMkJ6QyxLQUFLLENBQUN5QyxNQUFNLFFBQVEsR0FBRyxFQUFFO0FBQ2pGO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7O0FDVEQ7Ozs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBLDhDQUE4Qzs7Ozs7V0NBOUM7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTkE7QUFDMEI7O0FBRTFCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmVpc2V0b3BpYS1wbHVnaW4vLi9zcmMvcmVpc2V0b3BpYS1wbHVnaW4vamF2YXNjcmlwdC9jb21wb25lbnRzL2FwaS5qcyIsIndlYnBhY2s6Ly9yZWlzZXRvcGlhLXBsdWdpbi8uL3NyYy9yZWlzZXRvcGlhLXBsdWdpbi9qYXZhc2NyaXB0L2NvbXBvbmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luLy4vc3JjL3JlaXNldG9waWEtcGx1Z2luL2phdmFzY3JpcHQvY29tcG9uZW50cy9tYWluLmpzIiwid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luLy4vc3JjL3JlaXNldG9waWEtcGx1Z2luL2phdmFzY3JpcHQvY29tcG9uZW50cy9yZW5kZXJIb3RlbEl0ZW0uanMiLCJ3ZWJwYWNrOi8vcmVpc2V0b3BpYS1wbHVnaW4vLi9zcmMvcmVpc2V0b3BpYS1wbHVnaW4vc2Nzcy9hcHAuc2Nzcz8zMjRiIiwid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9yZWlzZXRvcGlhLXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcmVpc2V0b3BpYS1wbHVnaW4vLi9zcmMvcmVpc2V0b3BpYS1wbHVnaW4vamF2YXNjcmlwdC9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVuZGVySG90ZWxJdGVtIH0gZnJvbSAnLi9yZW5kZXJIb3RlbEl0ZW0uanMnO1xuXG5jb25zdCAkID0galF1ZXJ5Lm5vQ29uZmxpY3QoKTtcblxuLyoqXG4gKiBGZXRjaGVzIGhvdGVscyB1c2luZyB0aGUgUkVTVCBBUEkgYW5kIGFwcGxpZXMgdGhlIGdpdmVuIGZpbHRlcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGZpbHRlcnMgLSBUaGUgZmlsdGVycyB0byBhcHBseSAoZS5nLiwgbmFtZSwgbG9jYXRpb24pLlxuICovXG5leHBvcnQgY29uc3QgZmV0Y2hIb3RlbHNSZXN0QXBpID0gKGZpbHRlcnMgPSB7fSkgPT4ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVpc2V0b3BpYUhvdGVscy5yZXN0X3VybCk7IC8vIENyZWF0ZSBhIG5ldyBVUkwgb2JqZWN0IGZvciB0aGUgUkVTVCBBUEkgZW5kcG9pbnRcblxuICAgIC8vIEFwcGx5IGZpbHRlcnMgYnkgYWRkaW5nIHRoZW0gYXMgcXVlcnkgcGFyYW1ldGVycyB0byB0aGUgVVJMXG4gICAgT2JqZWN0LmtleXMoZmlsdGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGZpbHRlcnNba2V5XTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gRmV0Y2ggZGF0YSBmcm9tIHRoZSBSRVNUIEFQSVxuICAgIGZldGNoKHVybC50b1N0cmluZygpKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpIC8vIFBhcnNlIHRoZSBKU09OIHJlc3BvbnNlXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGhvdGVsc0xpc3QgPSAkKCcjanMtaG90ZWxzLWxpc3QnKTsgLy8gU2VsZWN0IHRoZSBob3RlbCBsaXN0IGVsZW1lbnRcbiAgICAgICAgICAgICRob3RlbHNMaXN0LmVtcHR5KCk7IC8vIENsZWFyIGFueSBleGlzdGluZyBob3RlbCBpdGVtc1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEgfHwgIUFycmF5LmlzQXJyYXkoZGF0YSkgfHwgZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkaG90ZWxzTGlzdC5odG1sKCc8cD5ObyBob3RlbHMgZm91bmQ8L3A+Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFJlbmRlciBlYWNoIGhvdGVsIGl0ZW0gYW5kIGFwcGVuZCBpdCB0byB0aGUgbGlzdFxuICAgICAgICAgICAgICAgIGRhdGEuZm9yRWFjaChob3RlbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhvdGVsSXRlbSA9IHJlbmRlckhvdGVsSXRlbShob3RlbCk7XG4gICAgICAgICAgICAgICAgICAgICRob3RlbHNMaXN0LmFwcGVuZChob3RlbEl0ZW0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgaG90ZWxzOicsIGVycm9yKTtcbiAgICAgICAgfSk7XG59O1xuXG4vKipcbiAqIEZldGNoZXMgaG90ZWxzIHVzaW5nIGFuIEFKQVggcmVxdWVzdCBhbmQgYXBwbGllcyB0aGUgZ2l2ZW4gZmlsdGVycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZmlsdGVycyAtIFRoZSBmaWx0ZXJzIHRvIGFwcGx5IChlLmcuLCBuYW1lLCBsb2NhdGlvbikuXG4gKi9cbmV4cG9ydCBjb25zdCBmZXRjaEhvdGVsc0FqYXggPSAoZmlsdGVycyA9IHt9KSA9PiB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChyZWlzZXRvcGlhSG90ZWxzLmFqYXhfdXJsKTsgLy8gQ3JlYXRlIGEgbmV3IFVSTCBvYmplY3QgZm9yIHRoZSBBSkFYIGVuZHBvaW50XG5cbiAgICAvLyBBZGQgdGhlIGFjdGlvbiBwYXJhbWV0ZXIgcmVxdWlyZWQgZm9yIHRoZSBBSkFYIGhhbmRsZXJcbiAgICB1cmwuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYWN0aW9uJywgJ3JlaXNldG9waWFfaG90ZWxzX2dldF9hbGwnKTtcblxuICAgIC8vIE1ha2UgdGhlIEFKQVggcmVxdWVzdCB1c2luZyBqUXVlcnlcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IHVybC50b1N0cmluZygpLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJywgLy8gRXhwZWN0IEpTT04gZGF0YSBpbiByZXNwb25zZVxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBub25jZTogcmVpc2V0b3BpYUhvdGVsc05vbmNlLCAvLyBJbmNsdWRlIHRoZSBub25jZSBmb3Igc2VjdXJpdHlcbiAgICAgICAgICAgIC4uLmZpbHRlcnMgLy8gSW5jbHVkZSB0aGUgZmlsdGVycyBpbiB0aGUgcmVxdWVzdCBkYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0ICRob3RlbHNMaXN0ID0gJCgnI2pzLWhvdGVscy1saXN0Jyk7IC8vIFNlbGVjdCB0aGUgaG90ZWwgbGlzdCBlbGVtZW50XG4gICAgICAgICAgICAkaG90ZWxzTGlzdC5lbXB0eSgpOyAvLyBDbGVhciBhbnkgZXhpc3RpbmcgaG90ZWwgaXRlbXNcblxuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyAmJiBkYXRhLmRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRGlzcGxheSBhIG1lc3NhZ2UgaWYgbm8gaG90ZWxzIGFyZSBmb3VuZFxuICAgICAgICAgICAgICAgICRob3RlbHNMaXN0Lmh0bWwoJzxwPk5vIGhvdGVscyBmb3VuZDwvcD4nKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVuZGVyIGVhY2ggaG90ZWwgaXRlbSBhbmQgYXBwZW5kIGl0IHRvIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgZGF0YS5kYXRhLmZvckVhY2goaG90ZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBob3RlbEl0ZW0gPSByZW5kZXJIb3RlbEl0ZW0oaG90ZWwpO1xuICAgICAgICAgICAgICAgICAgICAkaG90ZWxzTGlzdC5hcHBlbmQoaG90ZWxJdGVtKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGhvdGVsc0xpc3QuaHRtbCgnPHA+RXJyb3IgZmV0Y2hpbmcgaG90ZWxzPC9wPicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBob3RlbHM6JywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIGxpc3Qgb2YgaG90ZWxzIGJhc2VkIG9uIHRoZSBzZWxlY3RlZCBBUEkgZW5kcG9pbnQgYW5kIGFwcGxpZWQgZmlsdGVycy5cbiAqL1xuZXhwb3J0IGNvbnN0IHVwZGF0ZUhvdGVsc0FwaSA9ICgpID0+IHtcbiAgICBjb25zdCBzZWxlY3RlZEVuZHBvaW50ID0gJCgnI2pzLWVuZHBvaW50LXNlbGVjdCcpLnZhbCgpOyAvLyBHZXQgdGhlIHNlbGVjdGVkIEFQSSBlbmRwb2ludCAoUkVTVCBvciBBSkFYKVxuICAgIGNvbnN0IGZpbHRlcnMgPSB7XG4gICAgICAgIG5hbWU6ICQoJyNqcy1maWx0ZXItbmFtZScpLnZhbCgpLFxuICAgICAgICBsb2NhdGlvbjogJCgnI2pzLWZpbHRlci1sb2NhdGlvbicpLnZhbCgpLFxuICAgICAgICBtYXhfcHJpY2U6IHVuZGVmaW5lZFxuICAgIH07XG5cbiAgICAvLyBDbGVhciB0aGUgaG90ZWwgbGlzdCBiZWZvcmUgZmV0Y2hpbmcgbmV3IGRhdGFcbiAgICBjb25zdCAkaG90ZWxzTGlzdCA9ICQoJyNqcy1ob3RlbHMtbGlzdCcpO1xuICAgICRob3RlbHNMaXN0LmVtcHR5KCk7XG5cbiAgICAvLyBGZXRjaCBob3RlbHMgYmFzZWQgb24gdGhlIHNlbGVjdGVkIEFQSSBlbmRwb2ludFxuICAgIGlmIChzZWxlY3RlZEVuZHBvaW50ID09PSAncmVzdCcpIHtcbiAgICAgICAgZmV0Y2hIb3RlbHNSZXN0QXBpKGZpbHRlcnMpO1xuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRFbmRwb2ludCA9PT0gJ2FqYXgnKSB7XG4gICAgICAgIGZldGNoSG90ZWxzQWpheChmaWx0ZXJzKTtcbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgdXBkYXRlSG90ZWxzQXBpIH0gZnJvbSAnLi9hcGkuanMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgdGhlIGV4ZWN1dGlvbiBvZiB0aGUgZ2l2ZW4gZnVuY3Rpb25cbiAqIHVudGlsIGFmdGVyIHRoZSBzcGVjaWZpZWQgd2FpdCB0aW1lIGhhcyBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgaXQgd2FzIGludm9rZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyAtIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IC0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICAgIGxldCB0aW1lb3V0O1xuXG4gICAgLy8gUmV0dXJuIGEgbmV3IGZ1bmN0aW9uIHRoYXQgY2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyBidXQgd2lsbCBvbmx5XG4gICAgLy8gZXhlY3V0ZSB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNwZWNpZmllZCBkZWxheS5cbiAgICByZXR1cm4gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7IC8vIENsZWFyIHRoZSBwcmV2aW91cyB0aW1lb3V0LCBpZiBhbnlcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKSwgd2FpdCk7IC8vIFNldCBhIG5ldyB0aW1lb3V0XG4gICAgfTtcbn1cblxuLy8gQ3JlYXRlIGEgZGVib3VuY2VkIHZlcnNpb24gb2YgdGhlIHVwZGF0ZUhvdGVsc0FwaSBmdW5jdGlvbiB3aXRoIGEgMzAwbXMgZGVsYXlcbmNvbnN0IGRlYm91bmNlZFVwZGF0ZUhvdGVsc0FwaSA9IGRlYm91bmNlKHVwZGF0ZUhvdGVsc0FwaSwgMzAwKTtcblxuLyoqXG4gKiBIYW5kbGVyIGZvciB3aGVuIHRoZSBBUEkgZW5kcG9pbnQgc2VsZWN0aW9uIGNoYW5nZXMuXG4gKiBJdCB0cmlnZ2VycyB0aGUgZGVib3VuY2VkIHVwZGF0ZUhvdGVsc0FwaSBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGNvbnN0IG9uRW5kcG9pbnRDaGFuZ2UgPSAoKSA9PiB7XG4gICAgZGVib3VuY2VkVXBkYXRlSG90ZWxzQXBpKCk7IC8vIENhbGwgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB0byB1cGRhdGUgaG90ZWxzXG59O1xuXG4vKipcbiAqIEhhbmRsZXIgZm9yIHdoZW4gYW55IGZpbHRlciBpbnB1dCAoZS5nLiwgbmFtZSBvciBsb2NhdGlvbikgY2hhbmdlcy5cbiAqIEl0IHRyaWdnZXJzIHRoZSBkZWJvdW5jZWQgdXBkYXRlSG90ZWxzQXBpIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgY29uc3Qgb25JbnB1dENoYW5nZSA9ICgpID0+IHtcbiAgICBkZWJvdW5jZWRVcGRhdGVIb3RlbHNBcGkoKTsgLy8gQ2FsbCB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHRvIHVwZGF0ZSBob3RlbHNcbn07XG4iLCJpbXBvcnQgeyBmZXRjaEhvdGVsc1Jlc3RBcGkgfSBmcm9tICcuL2FwaS5qcyc7XG5pbXBvcnQgeyBvbkVuZHBvaW50Q2hhbmdlLCBvbklucHV0Q2hhbmdlIH0gZnJvbSAnLi9ldmVudHMuanMnO1xuXG5jb25zdCAkID0galF1ZXJ5Lm5vQ29uZmxpY3QoKTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIC8vIERlZmF1bHQgQVBJIGxvYWRcbiAgICBmZXRjaEhvdGVsc1Jlc3RBcGkoKTtcblxuICAgIC8vIEluaXRpYWxpemUgZXZlbnQgbGlzdGVuZXJzXG4gICAgJCgnI2pzLWVuZHBvaW50LXNlbGVjdCcpLm9uKCdjaGFuZ2UnLCBvbkVuZHBvaW50Q2hhbmdlKTtcbiAgICAkKCcjanMtZmlsdGVyLW5hbWUsICNqcy1maWx0ZXItbG9jYXRpb24nKS5vbignaW5wdXQnLCBvbklucHV0Q2hhbmdlKTtcbn0pO1xuIiwiZXhwb3J0IGNvbnN0IHJlbmRlckhvdGVsSXRlbSA9IChob3RlbCkgPT4ge1xuICAgIHJldHVybiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyYS1ob3RlbHMtbGlzdF9faXRlbVwiPlxuICAgICAgICAgICAgPGg1PiR7aG90ZWwudGl0bGV9PC9oNT5cbiAgICAgICAgICAgIDxwPjxzcGFuPkxvY2F0aW9uOjwvc3Bhbj4gJHtob3RlbC5jb3VudHJ5fSwgJHtob3RlbC5jaXR5fTwvcD5cbiAgICAgICAgICAgIDxwPjxzcGFuPlByaWNlIFJhbmdlOjwvc3Bhbj4gJHtob3RlbFsncHJpY2VSYW5nZSddLm1pbn0sICR7aG90ZWxbJ3ByaWNlUmFuZ2UnXS5tYXh9PC9wPlxuICAgICAgICAgICAgJHtob3RlbC5yYXRpbmcgPyBgPHA+PHNwYW4+UmF0aW5nOjwvc3Bhbj4gJHtob3RlbC5yYXRpbmd9LzU8L3A+YCA6ICcnfVxuICAgICAgICA8L2Rpdj5cbiAgICBgO1xufTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qKiBTdHlsZXMgKi9cbmltcG9ydCAnLi4vc2Nzcy9hcHAuc2Nzcyc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZixuby11bnVzZWQtdmFyc1xuXG5pbXBvcnQgJy4vY29tcG9uZW50cy9tYWluJztcblxuIl0sIm5hbWVzIjpbInJlbmRlckhvdGVsSXRlbSIsIiQiLCJqUXVlcnkiLCJub0NvbmZsaWN0IiwiZmV0Y2hIb3RlbHNSZXN0QXBpIiwiZmlsdGVycyIsInVybCIsIlVSTCIsInJlaXNldG9waWFIb3RlbHMiLCJyZXN0X3VybCIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwidmFsdWUiLCJzZWFyY2hQYXJhbXMiLCJhcHBlbmQiLCJmZXRjaCIsInRvU3RyaW5nIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImRhdGEiLCIkaG90ZWxzTGlzdCIsImVtcHR5IiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwiaHRtbCIsImhvdGVsIiwiaG90ZWxJdGVtIiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJmZXRjaEhvdGVsc0FqYXgiLCJhamF4X3VybCIsImFqYXgiLCJtZXRob2QiLCJkYXRhVHlwZSIsIm5vbmNlIiwicmVpc2V0b3BpYUhvdGVsc05vbmNlIiwic3VjY2VzcyIsInhociIsInN0YXR1cyIsInVwZGF0ZUhvdGVsc0FwaSIsInNlbGVjdGVkRW5kcG9pbnQiLCJ2YWwiLCJuYW1lIiwibG9jYXRpb24iLCJtYXhfcHJpY2UiLCJ1bmRlZmluZWQiLCJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwidGltZW91dCIsImFyZ3MiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiYXBwbHkiLCJkZWJvdW5jZWRVcGRhdGVIb3RlbHNBcGkiLCJvbkVuZHBvaW50Q2hhbmdlIiwib25JbnB1dENoYW5nZSIsImRvY3VtZW50IiwicmVhZHkiLCJvbiIsInRpdGxlIiwiY291bnRyeSIsImNpdHkiLCJtaW4iLCJtYXgiLCJyYXRpbmciXSwic291cmNlUm9vdCI6IiJ9