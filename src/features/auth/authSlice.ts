import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
    token: string | null
}

const getInitialToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token')
    }
    return null
}

const initialState: AuthState = {
    token: getInitialToken()
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
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', accessToken)
            }
        },
        logout: state => {
            state.token = null
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token')
            }
        }
    }
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
