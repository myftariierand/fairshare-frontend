import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/features/auth/authSlice'
import drawerReducer from '@/features/quick-actions/drawerSlice'

import { api } from '@/app/api'

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        drawer: drawerReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
