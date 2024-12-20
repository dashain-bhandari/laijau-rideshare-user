

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
    },
    stopLocation: {
        stopLatitude: number | undefined,
        stopLongitude: number | undefined,
        stopAddress: string | undefined
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
    },
    stopLocation: {
        stopLatitude: undefined,
        stopLongitude: undefined,
        stopAddress: undefined
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
        ,
        setStopLocation: (state, action) => {
            state.stopLocation = action.payload
        }
    }
})

export const { setUserLocation, setDestinationLocation, setStopLocation } = locationSlice.actions

export default locationSlice.reducer;