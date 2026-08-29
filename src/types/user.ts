import { Friend } from '@/types/friend'
import { Member, Group as RootGroup, Transaction } from '@/types/group'

export type User = {
    id: string
    name: string
    email: string
    createdAt: Date
    updatedAt: Date
    provider: string
}

export interface Group extends RootGroup {
    transactions: (Transaction & {
        paidById: string
        group: { currency: string }
    })[]
    members: Member[]
}

export interface Profile extends User {
    groups: Group[]
    friends: Friend[]
}
