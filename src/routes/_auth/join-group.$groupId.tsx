import { createFileRoute, redirect } from '@tanstack/react-router'

import { store } from '@/app/store'
import { groupApi } from '@/app/services/group'

import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/_auth/join-group/$groupId')({
    loader: async ({ params: { groupId } }) => {
        const promise = store.dispatch(
            groupApi.endpoints.joinGroup.initiate({ groupId })
        )

        await promise.unwrap()

        throw redirect({ to: '/g/$group', params: { group: groupId } })
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
