import { api } from '@/app/api'

export const bugReportsApi = api.injectEndpoints({
    endpoints: builder => ({
        createBugReport: builder.mutation<
            void,
            {
                name?: string
                email?: string
                title: string
                description: string
                severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'COSMETIC'
                device?: string
            }
        >({
            query: body => ({
                url: '/bug-reports',
                method: 'POST',
                body
            })
        })
    })
})

export const { useCreateBugReportMutation } = bugReportsApi
