import { createFileRoute, redirect } from '@tanstack/react-router'

import { store } from '@/app/store'
import { groupApi } from '@/app/services/group'

import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/_auth/join-group/$token')({
    loader: async ({ params: { token } }) => {
        const promise = store.dispatch(
            groupApi.endpoints.joinGroup.initiate({ token })
        )

        const group = await promise.unwrap()

        throw redirect({ to: '/g/$group', params: { group: group.id } })
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
