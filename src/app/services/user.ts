import { api } from '@/app/api'

import type { User } from '@/types/user'
import type { FriendRequest } from '@/types/friend'

type SearchResult = User & {
    friendshipsReceiver: FriendRequest[]
}

export const userApi = api.injectEndpoints({
    endpoints: builder => ({
        searchFriends: builder.query<SearchResult[], { query: string }>({
            query: ({ query }) => ({
                url: '/users/search',
                params: { query },
                method: 'GET'
            }),
            providesTags: () => [{ type: 'User', id: 'LIST' }]
        })
    })
})

export const { useLazySearchFriendsQuery } = userApi
