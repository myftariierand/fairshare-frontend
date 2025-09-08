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
        createGroup: builder.mutation<
            Group,
            { name: string; currency: string; cover?: File }
        >({
            query: ({ name, currency, cover }) => {
                const formData = new FormData()

                formData.append('name', name)
                formData.append('currency', currency)
                if (cover) formData.append('cover', cover)

                return {
                    url: '/groups',
                    method: 'POST',
                    body: formData
                }
            },
            invalidatesTags: () => [{ type: 'Group', id: 'LIST' }]
        }),
        updateGroup: builder.mutation<
            Group,
            { id: string; name: string; currency: string; cover?: File }
        >({
            query: ({ id, name, currency, cover }) => {
                const formData = new FormData()
                formData.append('name', name)
                formData.append('currency', currency)

                if (cover) formData.append('cover', cover)

                return { url: `/groups/${id}`, method: 'PATCH', body: formData }
            },
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
            }),
            invalidatesTags: [{ type: 'Group', id: 'LIST' }]
        }),
        removeMember: builder.mutation<
            Group,
            { groupId: string; memberId: string }
        >({
            query: ({ groupId, memberId }) => ({
                url: `/groups/${groupId}/remove/${memberId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (_result, _error, { groupId }) => [
                { type: 'GroupInvite', id: 'LIST' },
                { type: 'Group', id: groupId },
                { type: 'FriendRequest', id: 'LIST' }
            ]
        }),
        leaveGroup: builder.mutation<void, { groupId: string }>({
            query: ({ groupId }) => ({
                url: `/groups/${groupId}/leave`,
                method: 'DELETE'
            }),
            invalidatesTags: (_result, _error, { groupId }) => [
                { type: 'Group', id: groupId },
                { type: 'GroupInvite', id: 'LIST' },
                { type: 'FriendRequest', id: 'LIST' }
            ]
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
    useJoinGroupMutation,
    useRemoveMemberMutation,
    useLeaveGroupMutation
} = groupApi
