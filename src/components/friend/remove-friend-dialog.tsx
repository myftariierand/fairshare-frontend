import { toast } from 'sonner'

import { useUnfriendUserMutation } from '@/app/services/friends'

import { Route } from '@/routes/_auth/$group/settings'

import { Friend } from '@/types/friend'

import { ConfirmDialog } from '@/components/ui/confirm-dialog'

type Props = {
    friend: Friend
}

const RemoveFriendDialog = (props: Props) => {
    const navigate = Route.useNavigate()
    const [unfriend, unfriendMutation] = useUnfriendUserMutation()

    return (
        <ConfirmDialog
            loading={unfriendMutation.isLoading}
            onConfirm={async () => {
                try {
                    await unfriend({ id: props.friend.requestId }).unwrap()
                    navigate({ to: '/' })
                } catch (error) {
                    toast.error('Something went wrong!')
                }
            }}
        />
    )
}

export default RemoveFriendDialog
