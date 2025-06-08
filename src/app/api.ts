import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError
} from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import { logout, setCredentials } from '@/features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include',
    prepareHeaders(headers, { getState }) {
        const token = (getState() as RootState).auth.token

        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }

        return headers
    }
})

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery(
            '/auth/refresh',
            api,
            extraOptions
        )

        if (
            refreshResult.data &&
            typeof refreshResult.data === 'object' &&
            'accessToken' in refreshResult.data &&
            typeof refreshResult.data.accessToken === 'string'
        ) {
            api.dispatch(
                setCredentials({ accessToken: refreshResult.data.accessToken })
            )
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }

    return result
}

export const api = createApi({
    baseQuery: baseQueryWithReauth,
    keepUnusedDataFor: Infinity,
    tagTypes: [
        'Group',
        'GroupInvite',
        'Friend',
        'FriendRequest',
        'User',
        'Transaction',
        'Profile'
    ],
    endpoints: () => ({})
})
