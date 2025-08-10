import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'

import { useGetActivitiesQuery } from '@/app/services/activity'

import { AcitivityLog, ActivityAction } from '@/types/acitivity'

import {
    User,
    Dot,
    UserLock,
    UserCog,
    Users,
    GitPullRequestArrow,
    GitPullRequestClosed,
    GitPullRequest,
    UserSearch,
    GitPullRequestDraft,
    UserPlus,
    ReceiptText,
    Handshake,
    UserMinus
} from 'lucide-react'

export const Route = createFileRoute('/_auth/activity')({
    component: RouteComponent
})

function RouteComponent() {
    const { data } = useGetActivitiesQuery({ page: 1 })
    const { user } = Route.useRouteContext()

    const logs = data?.data.reduce(
        (acc, item) => {
            const date = new Date(item.createdAt)
            const key = date.toLocaleString('default', {
                month: 'long',
                year: 'numeric'
            })

            if (!acc[key]) {
                acc[key] = []
            }

            acc[key].push(item)
            return acc
        },
        {} as Record<string, AcitivityLog[]>
    )

    const getLogConfig = (activity: AcitivityLog) => {
        const group = activity.snapshot?.group
        const transaction = activity.snapshot?.transaction

        switch (activity.action) {
            case ActivityAction.USER_REGISTERED:
                return { icon: <User />, label: 'You registered to FairShare' }
            case ActivityAction.USER_CHANGED_PASSWORD:
                return {
                    icon: <UserLock />,
                    label: 'You changed your password'
                }
            case ActivityAction.USER_UPDATED_PROFILE:
                return {
                    icon: <UserCog />,
                    label: 'You update your profile'
                }
            case ActivityAction.GROUP_CREATED:
                return {
                    icon: <Users />,
                    label: (
                        <>
                            <span>You created</span> {group?.name}
                        </>
                    )
                }
            case ActivityAction.FRIENDSHIP_REQUEST_SENT:
                if (user.id === activity.user.id) {
                    return {
                        icon: <GitPullRequestArrow />,
                        label: (
                            <>
                                <span>You sent a friend request to </span>
                                {activity.targetUser?.name}
                            </>
                        )
                    }
                } else {
                    return {
                        icon: <GitPullRequestArrow />,
                        label: (
                            <>
                                <span>You received a friend request from </span>
                                {activity.user?.name}
                            </>
                        )
                    }
                }
            case ActivityAction.FRIENDSHIP_REQUEST_CANCELLED:
                return {
                    icon: <GitPullRequestClosed />,
                    label: (
                        <>
                            <span>You cancelled friend request to </span>
                            {activity.user?.name}
                        </>
                    )
                }
            case ActivityAction.FRIENDSHIP_REQUEST_REJECTED:
                return {
                    icon: <GitPullRequestDraft />,
                    label: (
                        <>
                            <span>You rejected friend request from</span>
                            {activity.targetUser?.name}
                        </>
                    )
                }
            case ActivityAction.FRIENDSHIP_REQUEST_ACCEPTED:
                return {
                    icon: <GitPullRequest />,
                    label: (
                        <>
                            {activity.targetUser?.name}
                            <span> accepted your friend request</span>
                        </>
                    )
                }
            case ActivityAction.FRIENDSHIP_REMOVED:
                return {
                    icon: <GitPullRequest />,
                    label: (
                        <>
                            <span>You removed </span>
                            {activity.user?.name}
                            <span> from your friends</span>
                        </>
                    )
                }
            case ActivityAction.GROUP_INVITATION_SENT:
                return {
                    icon: <UserSearch />,
                    label: (
                        <>
                            {activity.user?.name}
                            <span> invited </span>
                            {activity.targetUser?.name}
                            <span> to join </span>
                            {group?.name}
                        </>
                    )
                }
            case ActivityAction.GROUP_INVITATION_REJECTED:
                return {
                    icon: <UserSearch />,
                    label: (
                        <>
                            {activity.user?.name}
                            <span> rejected invitation to join </span>
                            {group?.name}
                        </>
                    )
                }
            case ActivityAction.GROUP_INVITATION_ACCEPTED:
                return {
                    icon: <UserPlus />,
                    label: (
                        <>
                            {activity.user?.name}
                            <span> accepted invitation to join </span>
                            {group?.name}
                        </>
                    )
                }
            case ActivityAction.GROUP_UPDATED:
                return {
                    icon: <Users />,
                    label: (
                        <>
                            {activity.user?.name}
                            <span> updated </span>
                            {group?.name}
                        </>
                    )
                }
            case ActivityAction.GROUP_MEMBER_REMOVED:
                return {
                    icon: <UserMinus />,
                    label: (
                        <>
                            {activity.targetUser?.name}
                            <span> has been removed from </span>
                            {group?.name}
                        </>
                    )
                }
            case ActivityAction.GROUP_MEMBER_JOINED:
                return {
                    icon: <UserPlus />,
                    label: (
                        <>
                            {activity.user?.name}
                            <span> joined </span>
                            {group?.name}
                        </>
                    )
                }
            case ActivityAction.GROUP_MEMBER_LEFT:
                return {
                    icon: <UserMinus />,
                    label: (
                        <>
                            {activity.user?.name}
                            <span> left </span>
                            {group?.name}
                        </>
                    )
                }
            case ActivityAction.GROUP_DELETED:
                return {
                    icon: <Users />,
                    label: (
                        <>
                            {group?.name}
                            <span> has been deleted</span>
                        </>
                    )
                }
            case ActivityAction.TRANSACTION_CREATED:
                return {
                    icon: <ReceiptText />,
                    label: (
                        <>
                            {activity.user?.name}
                            <span> added </span>
                            {transaction?.description}
                            <span> to </span>
                            {group?.name}
                        </>
                    )
                }
            case ActivityAction.TRANSACTION_UPDATED:
                return {
                    icon: <ReceiptText />,
                    label: (
                        <>
                            {activity.user?.name}
                            <span> update </span>
                            {transaction?.description}
                            <span> in </span>
                            {group?.name}
                        </>
                    )
                }
            case ActivityAction.TRANSACTION_DELETED:
                return {
                    icon: <ReceiptText />,
                    label: (
                        <>
                            {activity.user?.name}
                            <span> deleted </span>
                            {transaction?.description}
                            <span> from </span>
                            {group?.name}
                        </>
                    )
                }
            case ActivityAction.TRANSACTION_SETTLED:
                return {
                    icon: <Handshake />,
                    label: (
                        <>
                            You <span>and</span> {activity.targetUser?.name}
                            <span> are settled in </span>
                            {group?.name}
                        </>
                    )
                }

            default:
                break
        }
    }

    return (
        <div className='mx-2'>
            <div className='sticky top-0 bg-background h-14 flex items-center'>
                <h1 className='font-bold text-xl'>Activity Logs</h1>
            </div>
            <div className='gap-2 font-semibold'>
                {logs &&
                    Object.keys(logs).map(key => {
                        const activities = logs[key]

                        return (
                            <div key={key}>
                                <h2 className='py-4 sticky top-14 bg-background'>
                                    {key}
                                </h2>
                                <ul className='space-y-6'>
                                    {activities.map(activity => {
                                        const config = getLogConfig(activity)

                                        return (
                                            <li
                                                key={activity.id}
                                                className='flex items-center gap-4'
                                            >
                                                <div>{config?.icon}</div>
                                                <div className='[&>span]:text-muted-foreground'>
                                                    {config?.label}
                                                    <div className='flex items-center text-muted-foreground text-sm'>
                                                        {format(
                                                            activity.createdAt,
                                                            'dd MMM yyyy'
                                                        )}
                                                        <Dot />
                                                        {format(
                                                            activity.createdAt,
                                                            'HH:mm'
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}
