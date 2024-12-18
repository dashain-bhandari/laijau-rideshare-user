import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

interface InitialState {
    scheduledRide: {
        status: "accepted" | "started" | "ended" | "canceled",
        driver: any,
        user: any,
        pickup: any,
        dropOff: any,
        price: any,
        riderStatus: any,
        rideId:any
    } | undefined

}

const initialState: any = {
    scheduledRide: undefined,

}
const scheduledRideSlice = createSlice({
    name: "scheduledRide",
    initialState: initialState,
    reducers: {
        setStatus: (state, action) => {
            state.scheduledRide = { ...state, status: action.payload }
        },
        setScheduledRide: (state, action) => {
            state.scheduledRide = action.payload
        }
    }
})

export const { setStatus, setScheduledRide } = scheduledRideSlice.actions
export default scheduledRideSlice.reducer;
