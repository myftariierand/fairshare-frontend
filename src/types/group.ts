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

type BaseTransaction = {
    id: string
    description: string
    createdAt: Date
    paidBy: User
    amount: number
    balance: number
    splits: { userId: string; amount: number }[]
}

export type Transaction =
    | (BaseTransaction & {
          type: TransactionType.expense
          category: TransactionCategory
      })
    | (BaseTransaction & {
          type: TransactionType.settlement
          category: null
      })

export enum TransactionCategory {
    FOOD = 'FOOD',
    GROCERIES = 'GROCERIES',
    ACCOMMODATION = 'ACCOMMODATION',
    TRANSPORTATION = 'TRANSPORTATION',
    UTILITIES = 'UTILITIES',
    ENTERTAINMENT = 'ENTERTAINMENT',
    SHOPPING = 'SHOPPING',
    TRAVEL = 'TRAVEL',
    GIFTS = 'GIFTS',
    HEALTH = 'HEALTH',
    FEES = 'FEES',
    OTHER = 'OTHER'
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
