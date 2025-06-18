import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
    token: string | null
}

const initialState: AuthState = {
    token: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ accessToken: string }>
        ) => {
            const { accessToken } = action.payload
            state.token = accessToken
        },
        logout: state => {
            state.token = null
        }
    }
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
