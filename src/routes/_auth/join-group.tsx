import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { store } from '@/app/store'
import { groupApi } from '@/app/services/group'

import { Spinner } from '@/components/ui/spinner'

const SearchSchema = z.object({
    id: z.string().uuid()
})

export const Route = createFileRoute('/_auth/join-group')({
    validateSearch: SearchSchema,
    loaderDeps: ({ search: { id } }) => ({ id }),
    loader: async ({ deps: { id } }) => {
        const promise = store.dispatch(
            groupApi.endpoints.joinGroup.initiate({ groupId: id })
        )

        await promise.unwrap()

        throw redirect({ to: '/$group', params: { group: id } })
    },
    errorComponent: () => {
        return <div>Something Went Wrong!</div>
    },
    pendingComponent: () => {
        return (
            <div className='flex items-center pt-24 flex-col gap-4'>
                <Spinner size={36} />
            </div>
        )
    }
})
