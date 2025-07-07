import { FriendDrawerProvider } from '../friend/add-friend-drawer-context'
import { GroupDrawerProvider } from '../group/create-group-drawer-context'

const NavigationDrawerContext = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <GroupDrawerProvider>
            <FriendDrawerProvider>{children}</FriendDrawerProvider>
        </GroupDrawerProvider>
    )
}

export default NavigationDrawerContext
