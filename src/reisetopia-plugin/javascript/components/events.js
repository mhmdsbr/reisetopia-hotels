import { updateHotelsApi } from './api.js';

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
    return function(...args) {
        clearTimeout(timeout); // Clear the previous timeout, if any
        timeout = setTimeout(() => func.apply(this, args), wait); // Set a new timeout
    };
}

// Create a debounced version of the updateHotelsApi function with a 300ms delay
const debouncedUpdateHotelsApi = debounce(updateHotelsApi, 300);

/**
 * Handler for when the API endpoint selection changes.
 * It triggers the debounced updateHotelsApi function.
 */
export const onEndpointChange = () => {
    debouncedUpdateHotelsApi(); // Call the debounced function to update hotels
};

/**
 * Handler for when any filter input (e.g., name or location) changes.
 * It triggers the debounced updateHotelsApi function.
 */
export const onInputChange = () => {
    debouncedUpdateHotelsApi(); // Call the debounced function to update hotels
};
