import { api } from '@/app/api'

import type { User } from '@/types/user'
import { GroupInviteStatus } from '@/types/common'

type SearchResult = User & {
    // eslint-disable-next-line
    friendshipsReceiver: any[]
    invitationReceiver: { status: GroupInviteStatus }[]
}

export const userApi = api.injectEndpoints({
    endpoints: builder => ({
        searchUser: builder.query<
            SearchResult[],
            { query: string; groupId?: string }
        >({
            query: ({ query, groupId }) => ({
                url: '/users/search',
                params: { query, groupId },
                method: 'GET'
            }),
            providesTags: () => [{ type: 'User', id: 'LIST' }]
        })
    })
})

export const { useLazySearchUserQuery } = userApi
