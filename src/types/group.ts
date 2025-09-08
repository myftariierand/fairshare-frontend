import { z } from 'zod'

import { User } from '@/types/user'
import { GroupInviteStatus, TransactionType } from '@/types/common'

export type Group = {
    id: string
    name: string
    currency: string
    createdAt: string
    createdById: string
    cover?: string
    _count: {
        members: number
    }
}

export const MemberSchema = z.object({
    id: z.string().uuid(),
    joinedAt: z.date(),
    name: z.string(),
    email: z.string().email()
})

export type Member = z.infer<typeof MemberSchema>

export type Transaction = {
    id: string
    groupId: string
    createdById: string
    paidBy: User
    amount: number
    description: string
    createdAt: Date
    updatedAt: Date
    type: TransactionType
    splits: { userId: string }[]
}

export type SingleGroup = {
    createdBy: User
    members: Member[]
    transactions: Transaction[]
    settlements: Settelment[]
} & Group

export type Settelment = {
    from: {
        id: string
        name: string
    }
    to: {
        id: string
        name: string
    }
    amount: number
}

export type GroupInvite = {
    id: string
    status: GroupInviteStatus
    groupId: string
    senderId: string
    receiverId: string
    group: Group
    sender: User
    createdAt: Date
    updatedAt: Date
}
