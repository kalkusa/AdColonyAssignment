import { configureStore } from '@reduxjs/toolkit';
import serviceAvailabilityReducer from '../features/service-availability/service-availability-slice.js';

export default configureStore({
    reducer: {
        serviceAvailability: serviceAvailabilityReducer
    },
});
