import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

interface InitialState {
    bookedForFriend: {
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
    bookedForFriend: undefined,

}
const bookForFriendSlice = createSlice({
    name: "bookedForFriend",
    initialState: initialState,
    reducers: {
        setStatus: (state, action) => {
            state.bookedForFriendRide = { ...state, status: action.payload }
        },
        setBookedRide: (state, action) => {
            state.bookedForFriend = action.payload
        }
    }
})

export const { setStatus, setBookedRide } = bookForFriendSlice.actions
export default bookForFriendSlice.reducer;
