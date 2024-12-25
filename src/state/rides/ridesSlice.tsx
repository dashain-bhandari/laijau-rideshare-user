import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

interface InitialState {
   rides: {
        status: "accepted" | "started" | "ended" | "canceled",
        driver: any,
        user: any,
        pickup: any,
        dropOff: any,
        price: any,
        riderStatus: any,
        rideId:any,
        scheduled:any,
        scheduledDate:any,
    }[] | []

}

const initialState: any = {
    rides: undefined,

}
const ridesSlice = createSlice({
    name: "rides",
    initialState: initialState,
    reducers: {
     
        setRides: (state, action) => {
            state.rides = action.payload
        }
    }
})

export const { setRides} = ridesSlice.actions
export default ridesSlice.reducer;
