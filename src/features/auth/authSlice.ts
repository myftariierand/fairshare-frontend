import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
    token: string | null
    emailVerified: boolean
}

const initialState: AuthState = {
    token: null,
    emailVerified: false
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
        setVerified: (state, action: PayloadAction<boolean>) => {
            state.emailVerified = action.payload
        },
        logout: state => {
            state.token = null
        }
    }
})

export const { setCredentials, setVerified, logout } = authSlice.actions

export default authSlice.reducer
