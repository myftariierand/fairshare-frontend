import { api } from '@/app/api'

import { LoginData } from '@/schema/login'
import { RegisterData } from '@/schema/register'

import { logout } from '@/features/auth/authSlice'

import type { User } from '@/types/user'

type AuthResponse = {
    accessToken: string
}

export const authApi = api.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation<AuthResponse, LoginData>({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials
            })
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            onQueryStarted: async (
                _queryArgument,
                { dispatch, queryFulfilled }
            ) => {
                try {
                    await queryFulfilled
                    dispatch(logout())
                    setTimeout(() => {
                        dispatch(api.util.resetApiState())
                    }, 1000)
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        register: builder.mutation<AuthResponse, RegisterData>({
            query: credentials => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials
            })
        }),
        getProfile: builder.query<User, void>({
            query: () => ({
                url: '/auth/profile',
                method: 'GET'
            })
        }),
        changePassword: builder.mutation<
            void,
            { password: string; newPassword: string }
        >({
            query: credentials => ({
                url: '/auth/change-password',
                method: 'POST',
                body: credentials
            })
        })
    })
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGetProfileQuery,
    useLazyGetProfileQuery,
    useChangePasswordMutation
} = authApi
