import { createSlice } from "@reduxjs/toolkit";

interface InitialState{
   ongoingRide:{
    status:"accepted"|"started"|"ended"|"canceled",
   }|undefined

}

const initialState:InitialState={
    ongoingRide:undefined
}
const ongoingRideSlice = createSlice({
    name: "ongoingRide",
    initialState: initialState,
    reducers: {
        setStatus:(state,action)=>{
            state.ongoingRide={...state,status:action.payload}
        }
    }
})

export const {setStatus}=ongoingRideSlice.actions
export default ongoingRideSlice.reducer;
