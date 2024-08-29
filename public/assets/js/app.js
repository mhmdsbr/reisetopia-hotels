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
const fetchHotelsRestApi = (filters = {}) => {
  const url = new URL(reisetopiaHotels.rest_url);

  // Apply filters
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value) {
      url.searchParams.append(key, value);
    }
  });
  fetch(url.toString()).then(response => response.json()).then(data => {
    const $hotelsList = $('#js-hotels-list');
    $hotelsList.empty();
    if (!data || !Array.isArray(data) || data.length === 0) {
      $hotelsList.html('<p>No hotels found</p>');
    } else {
      data.forEach(hotel => {
        const hotelItem = (0,_renderHotelItem_js__WEBPACK_IMPORTED_MODULE_0__.renderHotelItem)(hotel);
        $hotelsList.append(hotelItem);
      });
    }
  }).catch(error => {
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
    success: function (data) {
      const $hotelsList = $('#js-hotels-list');
      $hotelsList.empty();
      if (data.success && data.data.length === 0) {
        $hotelsList.html('<p>No hotels found</p>');
      } else if (data.success) {
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
const updateHotelsApi = () => {
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

const onEndpointChange = () => {
  (0,_api_js__WEBPACK_IMPORTED_MODULE_0__.updateHotelsApi)();
};
const onInputChange = () => {
  (0,_api_js__WEBPACK_IMPORTED_MODULE_0__.updateHotelsApi)();
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
  // Default load
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQSw4Q0FBOEM7Ozs7O1dDQTlDO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05BO0FBQzBCOztBQUUxQiIsInNvdXJjZXMiOlsid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luLy4vc3JjL3JlaXNldG9waWEtcGx1Z2luL2phdmFzY3JpcHQvY29tcG9uZW50cy9hcGkuanMiLCJ3ZWJwYWNrOi8vcmVpc2V0b3BpYS1wbHVnaW4vLi9zcmMvcmVpc2V0b3BpYS1wbHVnaW4vamF2YXNjcmlwdC9jb21wb25lbnRzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9yZWlzZXRvcGlhLXBsdWdpbi8uL3NyYy9yZWlzZXRvcGlhLXBsdWdpbi9qYXZhc2NyaXB0L2NvbXBvbmVudHMvbWFpbi5qcyIsIndlYnBhY2s6Ly9yZWlzZXRvcGlhLXBsdWdpbi8uL3NyYy9yZWlzZXRvcGlhLXBsdWdpbi9qYXZhc2NyaXB0L2NvbXBvbmVudHMvcmVuZGVySG90ZWxJdGVtLmpzIiwid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luLy4vc3JjL3JlaXNldG9waWEtcGx1Z2luL3Njc3MvYXBwLnNjc3MiLCJ3ZWJwYWNrOi8vcmVpc2V0b3BpYS1wbHVnaW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmVpc2V0b3BpYS1wbHVnaW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3JlaXNldG9waWEtcGx1Z2luL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcmVpc2V0b3BpYS1wbHVnaW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9yZWlzZXRvcGlhLXBsdWdpbi8uL3NyYy9yZWlzZXRvcGlhLXBsdWdpbi9qYXZhc2NyaXB0L2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW5kZXJIb3RlbEl0ZW0gfSBmcm9tICcuL3JlbmRlckhvdGVsSXRlbS5qcyc7XG5cbmNvbnN0ICQgPSBqUXVlcnkubm9Db25mbGljdCgpO1xuXG5leHBvcnQgY29uc3QgZmV0Y2hIb3RlbHNSZXN0QXBpID0gKGZpbHRlcnMgPSB7fSkgPT4ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVpc2V0b3BpYUhvdGVscy5yZXN0X3VybCk7XG5cbiAgICAvLyBBcHBseSBmaWx0ZXJzXG4gICAgT2JqZWN0LmtleXMoZmlsdGVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGZpbHRlcnNba2V5XTtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZmV0Y2godXJsLnRvU3RyaW5nKCkpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkaG90ZWxzTGlzdCA9ICQoJyNqcy1ob3RlbHMtbGlzdCcpO1xuICAgICAgICAgICAgJGhvdGVsc0xpc3QuZW1wdHkoKTtcbiAgICAgICAgICAgIGlmICghZGF0YSB8fCAhQXJyYXkuaXNBcnJheShkYXRhKSB8fCBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICRob3RlbHNMaXN0Lmh0bWwoJzxwPk5vIGhvdGVscyBmb3VuZDwvcD4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKGhvdGVsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaG90ZWxJdGVtID0gcmVuZGVySG90ZWxJdGVtKGhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgJGhvdGVsc0xpc3QuYXBwZW5kKGhvdGVsSXRlbSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBob3RlbHM6JywgZXJyb3IpO1xuICAgICAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBmZXRjaEhvdGVsc0FqYXggPSAoZmlsdGVycyA9IHt9KSA9PiB7XG4gICAgY29uc3QgdXJsID0gbmV3IFVSTChyZWlzZXRvcGlhSG90ZWxzLmFqYXhfdXJsKTtcblxuICAgIC8vIEFkZCBhY3Rpb24gcGFyYW1ldGVyIGZvciBBSkFYIGhhbmRsZXJcbiAgICB1cmwuc2VhcmNoUGFyYW1zLmFwcGVuZCgnYWN0aW9uJywgJ3JlaXNldG9waWFfaG90ZWxzX2dldF9hbGwnKTtcblxuICAgIC8vIE1ha2UgdGhlIEFKQVggcmVxdWVzdFxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogdXJsLnRvU3RyaW5nKCksXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBub25jZTogcmVpc2V0b3BpYUhvdGVsc05vbmNlLFxuICAgICAgICAgICAgLi4uZmlsdGVycyAvLyBJbmNsdWRlIGZpbHRlcnNcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgJGhvdGVsc0xpc3QgPSAkKCcjanMtaG90ZWxzLWxpc3QnKTtcbiAgICAgICAgICAgICRob3RlbHNMaXN0LmVtcHR5KCk7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzICYmIGRhdGEuZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkaG90ZWxzTGlzdC5odG1sKCc8cD5ObyBob3RlbHMgZm91bmQ8L3A+Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGRhdGEuZGF0YS5mb3JFYWNoKGhvdGVsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaG90ZWxJdGVtID0gcmVuZGVySG90ZWxJdGVtKGhvdGVsKTtcbiAgICAgICAgICAgICAgICAgICAgJGhvdGVsc0xpc3QuYXBwZW5kKGhvdGVsSXRlbSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRob3RlbHNMaXN0Lmh0bWwoJzxwPkVycm9yIGZldGNoaW5nIGhvdGVsczwvcD4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgaG90ZWxzOicsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUhvdGVsc0FwaSA9ICgpID0+IHtcbiAgICBjb25zdCBzZWxlY3RlZEVuZHBvaW50ID0gJCgnI2pzLWVuZHBvaW50LXNlbGVjdCcpLnZhbCgpO1xuICAgIGNvbnN0IGZpbHRlcnMgPSB7XG4gICAgICAgIG5hbWU6ICQoJyNqcy1maWx0ZXItbmFtZScpLnZhbCgpLFxuICAgICAgICBsb2NhdGlvbjogJCgnI2pzLWZpbHRlci1sb2NhdGlvbicpLnZhbCgpXG4gICAgfTtcblxuICAgIC8vIENsZWFyIHRoZSBsaXN0IGJlZm9yZSBmZXRjaGluZyBuZXcgZGF0YVxuICAgIGNvbnN0ICRob3RlbHNMaXN0ID0gJCgnI2pzLWhvdGVscy1saXN0Jyk7XG4gICAgJGhvdGVsc0xpc3QuZW1wdHkoKTtcblxuICAgIGlmIChzZWxlY3RlZEVuZHBvaW50ID09PSAncmVzdCcpIHtcbiAgICAgICAgZmV0Y2hIb3RlbHNSZXN0QXBpKGZpbHRlcnMpO1xuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRFbmRwb2ludCA9PT0gJ2FqYXgnKSB7XG4gICAgICAgIGZldGNoSG90ZWxzQWpheChmaWx0ZXJzKTtcbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgdXBkYXRlSG90ZWxzQXBpIH0gZnJvbSAnLi9hcGkuanMnO1xuXG5leHBvcnQgY29uc3Qgb25FbmRwb2ludENoYW5nZSA9ICgpID0+IHtcbiAgICB1cGRhdGVIb3RlbHNBcGkoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBvbklucHV0Q2hhbmdlID0gKCkgPT4ge1xuICAgIHVwZGF0ZUhvdGVsc0FwaSgpO1xufTtcbiIsImltcG9ydCB7IGZldGNoSG90ZWxzUmVzdEFwaSB9IGZyb20gJy4vYXBpLmpzJztcbmltcG9ydCB7IG9uRW5kcG9pbnRDaGFuZ2UsIG9uSW5wdXRDaGFuZ2UgfSBmcm9tICcuL2V2ZW50cy5qcyc7XG5cbmNvbnN0ICQgPSBqUXVlcnkubm9Db25mbGljdCgpO1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgLy8gRGVmYXVsdCBsb2FkXG4gICAgZmV0Y2hIb3RlbHNSZXN0QXBpKCk7XG5cbiAgICAvLyBJbml0aWFsaXplIGV2ZW50IGxpc3RlbmVyc1xuICAgICQoJyNqcy1lbmRwb2ludC1zZWxlY3QnKS5vbignY2hhbmdlJywgb25FbmRwb2ludENoYW5nZSk7XG4gICAgJCgnI2pzLWZpbHRlci1uYW1lLCAjanMtZmlsdGVyLWxvY2F0aW9uJykub24oJ2lucHV0Jywgb25JbnB1dENoYW5nZSk7XG59KTtcbiIsImV4cG9ydCBjb25zdCByZW5kZXJIb3RlbEl0ZW0gPSAoaG90ZWwpID0+IHtcbiAgICByZXR1cm4gYFxuICAgICAgICA8ZGl2IGNsYXNzPVwicmEtaG90ZWxzLWxpc3RfX2l0ZW1cIj5cbiAgICAgICAgICAgIDxoNT4ke2hvdGVsLnRpdGxlfTwvaDU+XG4gICAgICAgICAgICA8cD48c3Bhbj5Mb2NhdGlvbjo8L3NwYW4+ICR7aG90ZWwuY291bnRyeX0sICR7aG90ZWwuY2l0eX08L3A+XG4gICAgICAgICAgICA8cD48c3Bhbj5QcmljZSBSYW5nZTo8L3NwYW4+ICR7aG90ZWxbJ3ByaWNlUmFuZ2UnXS5taW59LCAke2hvdGVsWydwcmljZVJhbmdlJ10ubWF4fTwvcD5cbiAgICAgICAgICAgICR7aG90ZWwucmF0aW5nID8gYDxwPjxzcGFuPlJhdGluZzo8L3NwYW4+ICR7aG90ZWwucmF0aW5nfS81PC9wPmAgOiAnJ31cbiAgICAgICAgPC9kaXY+XG4gICAgYDtcbn07XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKiogU3R5bGVzICovXG5pbXBvcnQgJy4uL3Njc3MvYXBwLnNjc3MnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWYsbm8tdW51c2VkLXZhcnNcblxuaW1wb3J0ICcuL2NvbXBvbmVudHMvbWFpbic7XG5cbiJdLCJuYW1lcyI6WyJyZW5kZXJIb3RlbEl0ZW0iLCIkIiwialF1ZXJ5Iiwibm9Db25mbGljdCIsImZldGNoSG90ZWxzUmVzdEFwaSIsImZpbHRlcnMiLCJ1cmwiLCJVUkwiLCJyZWlzZXRvcGlhSG90ZWxzIiwicmVzdF91cmwiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsInZhbHVlIiwic2VhcmNoUGFyYW1zIiwiYXBwZW5kIiwiZmV0Y2giLCJ0b1N0cmluZyIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJkYXRhIiwiJGhvdGVsc0xpc3QiLCJlbXB0eSIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImh0bWwiLCJob3RlbCIsImhvdGVsSXRlbSIsImNhdGNoIiwiZXJyb3IiLCJjb25zb2xlIiwiZmV0Y2hIb3RlbHNBamF4IiwiYWpheF91cmwiLCJhamF4IiwibWV0aG9kIiwiZGF0YVR5cGUiLCJub25jZSIsInJlaXNldG9waWFIb3RlbHNOb25jZSIsInN1Y2Nlc3MiLCJ4aHIiLCJzdGF0dXMiLCJ1cGRhdGVIb3RlbHNBcGkiLCJzZWxlY3RlZEVuZHBvaW50IiwidmFsIiwibmFtZSIsImxvY2F0aW9uIiwib25FbmRwb2ludENoYW5nZSIsIm9uSW5wdXRDaGFuZ2UiLCJkb2N1bWVudCIsInJlYWR5Iiwib24iLCJ0aXRsZSIsImNvdW50cnkiLCJjaXR5IiwibWluIiwibWF4IiwicmF0aW5nIl0sInNvdXJjZVJvb3QiOiIifQ==