import { useEffect } from 'react'

import { store } from '@/app/store'
import { groupApi } from '@/app/services/group'
import { friendApi } from '@/app/services/friends'

import { GroupInviteStatus } from '@/types/common'

const PrefetchHandler = () => {
    useEffect(() => {
        store.dispatch(groupApi.util.prefetch('getGroups', undefined, {}))
        store.dispatch(
            groupApi.util.prefetch(
                'getGroupInvites',
                { status: GroupInviteStatus.pending },
                {}
            )
        )
        store.dispatch(friendApi.util.prefetch('getFriends', undefined, {}))
        store.dispatch(
            friendApi.util.prefetch('getFriendRequests', undefined, {})
        )
    }, [])

    return null
}

export default PrefetchHandler
