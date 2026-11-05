import { api } from '@/app/api'

export const sseApi = api.injectEndpoints({
    endpoints: builder => ({
        createSseTicket: builder.mutation<{ ticket: string }, void>({
            query: () => ({
                url: '/sse/ticket',
                method: 'POST'
            })
        })
    })
})
