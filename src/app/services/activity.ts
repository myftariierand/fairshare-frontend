import { api } from '@/app/api'

import type { AcitivityLog } from '@/types/acitivity'

export const activityApi = api.injectEndpoints({
    endpoints: builder => ({
        getActivities: builder.query<
            { data: AcitivityLog[] },
            { page?: number }
        >({
            query: params => ({
                url: '/activity-logs',
                method: 'GET',
                params
            }),
            providesTags: () => [{ type: 'Activity', id: 'LIST' }]
        })
    })
})

export const { useGetActivitiesQuery } = activityApi
