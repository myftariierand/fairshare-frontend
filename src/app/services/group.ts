import { api } from '@/app/api'

import type { GroupInviteStatus } from '@/types/common'
import type { Group, SingleGroup, GroupInvite } from '@/types/group'

export const groupApi = api.injectEndpoints({
    endpoints: builder => ({
        getGroups: builder.query<Group[], void>({
            query: () => ({
                url: '/groups',
                method: 'GET'
            }),
            providesTags: () => [{ type: 'Group', id: 'LIST' }]
        }),
        getGroupById: builder.query<SingleGroup, { id: string }>({
            query: ({ id }) => ({
                url: `/groups/${id}`,
                method: 'GET'
            }),
            providesTags: (_result, _error, { id }) => [{ type: 'Group', id }]
        }),
        getGroupInvites: builder.query<
            GroupInvite[],
            { status: GroupInviteStatus }
        >({
            query: ({ status }) => ({
                url: '/groups/invites',
                method: 'GET',
                params: { status }
            }),
            providesTags: [{ type: 'GroupInvite', id: 'LIST' }]
        }),
        createGroup: builder.mutation<Group, { name: string }>({
            query: data => ({
                url: '/groups',
                method: 'POST',
                body: data
            }),
            invalidatesTags: () => [{ type: 'Group', id: 'LIST' }]
        }),
        updateGroup: builder.mutation<Group, { id: string; name: string }>({
            query: ({ id, ...data }) => ({
                url: `/groups/${id}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Group', id },
                { type: 'Group', id: 'LIST' }
            ]
        }),
        deleteGroup: builder.mutation<Group, { id: string }>({
            query: ({ id }) => ({
                url: `/groups/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'Group', id: 'LIST' }]
        }),
        inviteToGroup: builder.mutation<
            Group,
            { groupId: string; receiverId: string }
        >({
            query: ({ groupId, receiverId }) => ({
                url: `/groups/${groupId}/invite/${receiverId}`,
                method: 'POST'
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }]
        }),
        acceptGroupInvite: builder.mutation<
            GroupInvite,
            { groupId: string; inviteId: string }
        >({
            query: ({ groupId, inviteId }) => ({
                url: `/groups/${groupId}/invite/${inviteId}/accept`,
                method: 'POST'
            }),
            invalidatesTags: [
                { type: 'Group', id: 'LIST' },
                { type: 'GroupInvite', id: 'LIST' }
            ]
        }),
        rejectGroupInvite: builder.mutation<GroupInvite, { inviteId: string }>({
            query: ({ inviteId }) => ({
                url: `/groups/invite/${inviteId}/reject`,
                method: 'POST'
            }),
            invalidatesTags: [{ type: 'GroupInvite', id: 'LIST' }]
        }),
        joinGroup: builder.mutation<void, { groupId: string }>({
            query: ({ groupId }) => ({
                url: `/groups/${groupId}/join`,
                method: 'POST'
            })
        })
    })
})

export const {
    useGetGroupsQuery,
    useGetGroupByIdQuery,
    useGetGroupInvitesQuery,
    useCreateGroupMutation,
    useUpdateGroupMutation,
    useDeleteGroupMutation,
    useInviteToGroupMutation,
    useAcceptGroupInviteMutation,
    useRejectGroupInviteMutation,
    useJoinGroupMutation
} = groupApi
