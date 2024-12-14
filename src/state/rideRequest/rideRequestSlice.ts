import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RideRequest {
    setScreen: {
       
    tag: "destination" | "pickup"
    } | undefined,
    distanceInKm: number | undefined,
    timeInMinutes: number | undefined,
    initialPrice: number| undefined,
    minimumPrice: number| undefined,
    offeredPrice: number| undefined,
    vehicleType: string | undefined,
   
}

const initialState: RideRequest = {
    setScreen: undefined,
    distanceInKm: undefined,
    timeInMinutes: undefined,
    initialPrice: undefined,
    minimumPrice: undefined,
    offeredPrice: undefined,
    vehicleType: undefined,
    
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
      setSetScreen: (
        state,
        action: PayloadAction<{
        
          tag: "destination" | "pickup";
        }>
      ) => {
        state.setScreen = action.payload;
      },

     
    },
  });
export default rideRequestSlice.reducer;

export const {setDistanceInKm,setInitialPrice,setMinimumPrice,setOfferedPrice,setSetScreen,setTimeInMinutes,setVehicleType}=rideRequestSlice.actions