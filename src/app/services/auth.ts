import { api } from '@/app/api'

import { LoginData } from '@/schema/login'
import { RegisterData } from '@/schema/register'

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
        })
    })
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetProfileQuery,
    useLazyGetProfileQuery
} = authApi
