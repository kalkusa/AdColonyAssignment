import {
    createSlice
} from '@reduxjs/toolkit';

export const serviceAvailabilitySlice = createSlice({
    name: 'serviceAvailability',
    initialState: {
        status: 0
    },
    reducers: {
        update: (state, action) => {
            state.status = action.payload;
        }
    },
});

export const {
    update
} = serviceAvailabilitySlice.actions;


export const selectStatus = state => state.serviceAvailability.status;

export default serviceAvailabilitySlice.reducer;
