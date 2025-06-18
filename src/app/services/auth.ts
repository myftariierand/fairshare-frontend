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
            }),
            providesTags: ['Profile']
        }),
        changePassword: builder.mutation<
            void,
            { password: string; newPassword: string; confirmPassword: string }
        >({
            query: credentials => ({
                url: '/auth/change-password',
                method: 'POST',
                body: credentials
            })
        }),
        resetPassword: builder.mutation<
            void,
            { password: string; confirmPassword: string; token: string }
        >({
            query: credentials => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: credentials
            })
        }),
        sendResetPasswordEmail: builder.mutation<void, { email: string }>({
            query: credentials => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: credentials
            })
        }),
        verifyResetToken: builder.query<void, { token: string }>({
            query: ({ token }) => ({
                url: `/auth/verify-reset-token?token=${encodeURIComponent(token)}`,
                method: 'GET'
            })
        }),
        updateProfile: builder.mutation<User, { name: string }>({
            query: body => ({
                url: '/auth/update-profile',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Profile']
        })
    })
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGetProfileQuery,
    useLazyGetProfileQuery,
    useChangePasswordMutation,
    useResetPasswordMutation,
    useSendResetPasswordEmailMutation,
    useVerifyResetTokenQuery,
    useUpdateProfileMutation
} = authApi
