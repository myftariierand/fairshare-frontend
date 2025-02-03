import { api } from '@/app/api'

type CreateTransaction = {
    groupId: string
    amount: number
    description: string
    splits: { userId: string; amount: number }[]
}

export const transactionApi = api.injectEndpoints({
    endpoints: builder => ({
        createTransaction: builder.mutation<void, CreateTransaction>({
            query: data => ({
                url: '/transactions',
                method: 'POST',
                body: data
            })
        })
    })
})

export const { useCreateTransactionMutation } = transactionApi
