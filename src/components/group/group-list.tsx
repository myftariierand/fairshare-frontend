import { Link, MatchRoute } from '@tanstack/react-router'
import { format, formatDistance } from 'date-fns'

import { useGetGroupsQuery } from '@/app/services/group'

import { Eye, Loader, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import { Spinner } from '@/components/ui/spinner'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'

const GroupList = () => {
    const { data, isLoading, isError, isSuccess } = useGetGroupsQuery()

    let content

    if (isLoading) {
        content = <Loader className='animate-spin mx-auto mt-12' />
    }

    if (isError) {
        content = (
            <span className='text-center mt-12 block'>
                Something went wrong!
            </span>
        )
    }

    if (isSuccess) {
        const now = new Date()

        if (!data.length) {
            content = (
                <div className='grid place-items-center mt-12 text-muted-foreground space-y-2'>
                    <Users />
                    <span className='text-sm font-medium'>No Groups</span>
                </div>
            )
        } else {
            const activeGroups = data.filter(
                group =>
                    group._count.transactions === 0 || group.remainingDebts > 0
            )
            const settledGroups = data.filter(
                group =>
                    group._count.transactions > 0 && group.remainingDebts === 0
            )

            content = (
                <>
                    {activeGroups.map(group => (
                        <Card key={group.id} className='mb-4'>
                            {!!group.cover && (
                                <img
                                    src={`${import.meta.env.VITE_IMG_URL}/${group.cover}`}
                                    alt='active group cover'
                                    className='relative h-36 w-full object-cover rounded-xl'
                                />
                            )}
                            <CardHeader className='p-4'>
                                <CardTitle>{group.name}</CardTitle>
                                <CardDescription>
                                    {format(group.createdAt, 'MMM dd, yyyy')}{' '}
                                    &bull; {group.remainingDebts} remaining
                                    debts
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className='gap-2 p-2 pt-0'>
                                <Button
                                    asChild
                                    variant={'outline'}
                                    className='flex-1'
                                >
                                    <Link
                                        to='/g/$group'
                                        params={{ group: group.id }}
                                        search={{ drawer: true }}
                                    >
                                        <Plus /> Add Expense
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant={'outline'}
                                    className='flex-1'
                                >
                                    <Link
                                        to='/g/$group'
                                        params={{ group: group.id }}
                                    >
                                        <Eye /> View Group
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {/* <ul>
                        {activeGroups.splice(1).map(group => (
                            <li key={group.id}>
                                <Button
                                    asChild
                                    variant={'ghost'}
                                    className='p-1'
                                >
                                    <Link
                                        to='/g/$group'
                                        params={{ group: group.id }}
                                        className='flex gap-4 items-center w-full h-auto'
                                    >
                                        <Image
                                            className='size-12 rounded-lg shrink-0'
                                            src={
                                                group.cover
                                                    ? `c_fill,w_100,h_100,g_auto,f_auto,q_auto/${group.cover}`
                                                    : undefined
                                            }
                                        />
                                        <div className='flex flex-col grow'>
                                            <span className='font-semibold text-wrap'>
                                                {group.name}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                                {group._count.members} member(s)
                                            </span>
                                        </div>
                                        <MatchRoute
                                            to='/g/$group'
                                            params={{ group: group.id }}
                                            pending
                                        >
                                            {match => (
                                                <Spinner
                                                    show={!!match}
                                                    wait='delay-50'
                                                />
                                            )}
                                        </MatchRoute>
                                        <span className='text-xs text-muted-foreground'>
                                            {formatDistance(
                                                group.createdAt,
                                                now,
                                                {
                                                    addSuffix: true
                                                }
                                            )}
                                        </span>
                                    </Link>
                                </Button>
                            </li>
                        ))}
                    </ul> */}
                    {settledGroups.length > 0 && (
                        <Collapsible className='grow'>
                            <CollapsibleTrigger asChild>
                                <Button variant={'ghost'} className='w-full'>
                                    View Settled Groups ({settledGroups.length})
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent
                                asChild
                                className='flex flex-wrap gap-1'
                            >
                                <ul>
                                    {settledGroups.map(group => (
                                        <li key={group.id} className='w-full'>
                                            <Button
                                                asChild
                                                variant={'ghost'}
                                                className='p-1'
                                            >
                                                <Link
                                                    to='/g/$group'
                                                    params={{ group: group.id }}
                                                    className='flex gap-4 items-center w-full h-auto'
                                                >
                                                    <Image
                                                        className='size-12 rounded-lg shrink-0'
                                                        src={
                                                            group.cover
                                                                ? `c_fill,w_100,h_100,g_auto,f_auto,q_auto/${group.cover}`
                                                                : undefined
                                                        }
                                                    />
                                                    <div className='flex flex-col grow'>
                                                        <span className='font-semibold text-wrap'>
                                                            {group.name}
                                                        </span>
                                                        <span className='text-xs text-muted-foreground'>
                                                            {
                                                                group._count
                                                                    .members
                                                            }{' '}
                                                            member(s)
                                                        </span>
                                                    </div>
                                                    <MatchRoute
                                                        to='/g/$group'
                                                        params={{
                                                            group: group.id
                                                        }}
                                                        pending
                                                    >
                                                        {match => (
                                                            <Spinner
                                                                show={!!match}
                                                                wait='delay-50'
                                                            />
                                                        )}
                                                    </MatchRoute>
                                                    <span className='text-xs text-muted-foreground'>
                                                        {formatDistance(
                                                            group.createdAt,
                                                            now,
                                                            {
                                                                addSuffix: true
                                                            }
                                                        )}
                                                    </span>
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </CollapsibleContent>
                        </Collapsible>
                    )}
                </>
            )
        }
    }

    return content
}

export default GroupList
