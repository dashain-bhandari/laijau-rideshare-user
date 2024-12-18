import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import locationReducer from "./location/locationSlice";
import rideRequestReducer from "./rideRequest/rideRequestSlice";
import ongoingRideReducer from "./ongoingRide/ongoingRideSlice";
import scheduledRideReducer from "./scheduledRide/scheduledRideSlice";

export const store = configureStore({

    reducer: {
        user: userReducer,
        location: locationReducer,
        rideRequest: rideRequestReducer,
        ongoingRide: ongoingRideReducer,
        scheduledRide:scheduledRideReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:false
    }),
    
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch