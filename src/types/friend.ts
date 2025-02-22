import type { GroupInviteStatus } from '@/types/common'

export type Friend = {
    id: string
    name: string
    email: string
    createdAt: Date
    updatedAt: Date
    requestId: string
    invitations: [
        {
            status: GroupInviteStatus
            groupId: string
            groupName: string
        }
    ]
}
