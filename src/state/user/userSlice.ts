import { createSlice } from "@reduxjs/toolkit"

interface Address {
    addressLabel: string,
    addressName: string,
    addressLatitude: number,
    addressLongitude: number
}
interface UserState {
    user: {
        id: number,
        fullName: string,
        mobileNumber: string,
        email: string,
        savedAddresses: Address[]
    } | undefined
}

const initialState: UserState = {
    user: undefined
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        }
    }
})

export default userSlice.reducer;

export const { setUser } = userSlice.actions