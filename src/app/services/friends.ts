import { api } from '@/app/api'

import type { Friend } from '@/types/friend'

export const friendApi = api.injectEndpoints({
    endpoints: builder => ({
        getFriends: builder.query<Friend[], void>({
            query: () => ({
                url: '/friends',
                method: 'GET'
            }),
            providesTags: () => [{ type: 'Friend', id: 'LIST' }]
        }),
        getFriendRequests: builder.query<any[], void>({
            query: () => ({
                url: `/friends/requests`,
                method: 'GET'
            }),
            providesTags: () => [{ type: 'FriendRequest', id: 'LIST' }]
        }),
        sendRequest: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/friends/requests/${id}`,
                method: 'POST'
            }),
            invalidatesTags: () => [
                { type: 'User', id: 'LIST' },
                { type: 'FriendRequest', id: 'LIST' }
            ]
        }),
        acceptFriendRequest: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/friends/requests/${id}/accept`,
                method: 'PATCH'
            }),
            invalidatesTags: () => [
                { type: 'FriendRequest', id: 'LIST' },
                { type: 'Friend', id: 'LIST' }
            ]
        }),
        rejectFriendRequest: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/friends/requests/${id}/reject`,
                method: 'PATCH'
            }),
            invalidatesTags: () => [{ type: 'FriendRequest', id: 'LIST' }]
        }),
        cancelFriendRequest: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/friends/requests/${id}/cancel`,
                method: 'DELETE'
            }),
            invalidatesTags: () => [{ type: 'FriendRequest', id: 'LIST' }]
        }),
        unfriendUser: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/friends/requests/${id}/unfriend`,
                method: 'DELETE'
            }),
            invalidatesTags: () => [{ type: 'Friend', id: 'LIST' }]
        })
    })
})

export const {
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useSendRequestMutation,
    useAcceptFriendRequestMutation,
    useRejectFriendRequestMutation,
    useCancelFriendRequestMutation,
    useUnfriendUserMutation
} = friendApi
