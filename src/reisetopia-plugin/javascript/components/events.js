import { updateHotelsApi } from './api.js';

export const onEndpointChange = () => {
    updateHotelsApi();
};

export const onInputChange = () => {
    updateHotelsApi();
};
