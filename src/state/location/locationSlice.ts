

import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";


interface LocationState {
    userLocation: {
        userLatitude: number | undefined,
        userLongitude: number | undefined,
        userAddress: string | undefined,

    },
    destinationLocation: {
        destinationLatitude: number | undefined,
        destinationLongitude: number | undefined,
        destinationAddress: string | undefined
    }
}
const initialState: LocationState = {
    userLocation: {
        userLatitude: undefined,
        userLongitude: undefined,
        userAddress: undefined,
    },
    destinationLocation: {
        destinationLatitude: undefined,
        destinationLongitude: undefined,
        destinationAddress: undefined
    }
}
export const locationSlice = createSlice({
    name: "location",
    initialState: initialState,
    reducers: {
        setUserLocation: (state, action) => {
            state.userLocation = action.payload

        },
        setDestinationLocation: (state, action) => {
            state.destinationLocation = action.payload
        }
    }
})

export const { setUserLocation, setDestinationLocation } = locationSlice.actions

export default locationSlice.reducer;