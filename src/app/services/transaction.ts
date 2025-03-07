import { api } from '@/app/api'
import { User } from '@/types/user'

type CreateTransaction = {
    groupId: string
    amount: number
    description: string
    paidBy: string
    splits: { userId: string; amount: number }[]
}

type Transaction = {
    id: string
    description: string
    createdAt: Date
    paidBy: string
    amount: number
    balance: number
}

export type SingleTransaction = {
    groupId: string
    paidBy: User
    paidById: string
    createdBy: User
    createById: string
    splits: {
        id: string
        amount: number
        userId: string
        user: User
    }[]
} & Transaction

type UpdateTransaction = { id: string } & CreateTransaction

export const transactionApi = api.injectEndpoints({
    endpoints: builder => ({
        getTransactions: builder.query<Transaction[], { groupId: string }>({
            query: ({ groupId }) => ({
                url: `/transactions/${groupId}`,
                method: 'GET'
            }),
            providesTags: () => [{ type: 'Transaction', id: 'LIST' }]
        }),
        getTransactionById: builder.query<SingleTransaction, { id: string }>({
            query: ({ id }) => ({
                url: `/transactions/single/${id}`
            }),
            providesTags: (_result, _error, { id }) => [
                { type: 'Transaction', id }
            ]
        }),
        createTransaction: builder.mutation<void, CreateTransaction>({
            query: data => ({
                url: '/transactions',
                method: 'POST',
                body: data
            }),
            invalidatesTags: (_result, _error, { groupId }) => [
                { type: 'Transaction', id: 'LIST' },
                { type: 'Group', id: groupId }
            ]
        }),
        updateTransaction: builder.mutation<void, UpdateTransaction>({
            query: ({ id, ...rest }) => ({
                url: `/transactions/${id}`,
                method: 'PATCH',
                body: rest
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Transaction', id },
                { type: 'Transaction', id: 'LIST' }
            ]
        }),
        deleteTransaction: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/transactions/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: () => [{ type: 'Transaction', id: 'LIST' }]
        })
    })
})

export const {
    useGetTransactionsQuery,
    useGetTransactionByIdQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useDeleteTransactionMutation
} = transactionApi
