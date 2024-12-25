import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react";

interface RideRequest {
  setScreen: {
    tag: "destination" | "pickup"
  } | undefined,
  distanceInKm: number | undefined,
  timeInMinutes: number | undefined,
  initialPrice: number | undefined,
  minimumPrice: number | undefined,
  offeredPrice: number | undefined,
  vehicleType: string | undefined,
  rideId: string | undefined,
  scheduled: boolean,
  bookedForFriend: boolean,
  autoAccept: boolean,
  preferredVehicle: string | undefined,
  friendName: string | undefined,
  friendNumber: string | undefined

}

const initialState: RideRequest = {

  setScreen: undefined,
  distanceInKm: undefined,
  timeInMinutes: undefined,
  initialPrice: undefined,
  minimumPrice: undefined,
  offeredPrice: undefined,
  vehicleType: "Bike",
  rideId: undefined,
  scheduled: false,
  autoAccept: false,
  preferredVehicle: undefined,
  bookedForFriend: false,
  friendName: undefined,
  friendNumber: undefined

}

const rideRequestSlice = createSlice({

  name: "rideRequest",
  initialState,
  reducers: {
    setDistanceInKm: (state, action: PayloadAction<number>) => {
      state.distanceInKm = action.payload;
    },

    setTimeInMinutes: (state, action: PayloadAction<number>) => {
      state.timeInMinutes = action.payload;
    },

    setInitialPrice: (state, action: PayloadAction<number>) => {
      state.initialPrice = action.payload;
    },

    setMinimumPrice: (state, action: PayloadAction<number>) => {
      state.minimumPrice = action.payload;
    },

    setOfferedPrice: (state, action: PayloadAction<number>) => {
      state.offeredPrice = action.payload;
    },

    setVehicleType: (state, action: PayloadAction<string>) => {
      state.vehicleType = action.payload;
    },

    setRideId: (state, action) => {
      state.rideId = action.payload;
    },

    setPreferredVehicle: (state, action) => {
      state.preferredVehicle = action.payload
    },

    setSetScreen: (
      state,
      action: PayloadAction<{

        tag: "destination" | "pickup";
      }>
    ) => {
      state.setScreen = action.payload;
    },

    setScheduled: (state, action) => {
      state.scheduled = action.payload
    },
    setAutoAccept: (state, action) => {
      state.autoAccept = action.payload
    },
    setBookedForFriend: (state, action) => {
      state.bookedForFriend = action.payload
    },
    setFriendDetail: (state, action) => {
      state.friendName = action.payload.friendName
      state.friendNumber = action.payload.friendNumber
    }
  },
});
export default rideRequestSlice.reducer;

export const { setDistanceInKm, setInitialPrice, setMinimumPrice, setOfferedPrice, setSetScreen, setTimeInMinutes, setVehicleType, setRideId, setAutoAccept, setPreferredVehicle, setBookedForFriend, setFriendDetail } = rideRequestSlice.actions