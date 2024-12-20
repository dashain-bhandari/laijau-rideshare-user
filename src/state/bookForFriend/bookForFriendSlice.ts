import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

interface InitialState {
    bookedForFriendRide: {
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
    bookedRide: undefined,

}
const bookForFriendSlice = createSlice({
    name: "bookedForFriendRide",
    initialState: initialState,
    reducers: {
        setStatus: (state, action) => {
            state.bookedForFriendRide = { ...state, status: action.payload }
        },
        setBookedForFriend: (state, action) => {
            state.bookedForFriendRide = action.payload
        }
    }
})

export const { setStatus, setBookedForFriend } = bookForFriendSlice.actions
export default bookForFriendSlice.reducer;
