import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import {
    useGetFriendRequestsQuery,
    useUnfriendUserMutation
} from '@/app/services/friends'

import { Dot, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AddFriendDrawer from '@/components/friend/add-friend-drawer'
import FriendRequestsList from '@/components/friend/friend-requests-list'
import FriendsList from '@/components/friend/friends-list'

const TabSchema = z.enum(['friends', 'requests'])
type Tab = z.infer<typeof TabSchema>

const SearchSchema = z.object({
    t: z.enum(['friends', 'requests']).default('requests')
})

export const Route = createFileRoute('/_auth/friends')({
    validateSearch: SearchSchema,
    component: RouteComponent
})

function RouteComponent() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    const { data } = useGetFriendRequestsQuery()
    const [unfriend, unfriendMutation] = useUnfriendUserMutation()

    return (
        <>
            <header className='flex items-center py-3 justify-between'>
                <h1 className='font-bold text-xl'>Friends</h1>
                <AddFriendDrawer />
            </header>
            <Tabs
                value={search.t}
                onValueChange={value =>
                    navigate({ search: { t: value as Tab } })
                }
            >
                <TabsList className='w-full'>
                    <TabsTrigger value='requests' className='w-full'>
                        Requests{' '}
                        {!!data?.length && (
                            <Dot size={24} className='text-destructive' />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value='friends' className='w-full'>
                        Friends
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='requests'>
                    <FriendRequestsList />
                </TabsContent>
                <TabsContent value='friends'>
                    <FriendsList
                        renderButton={data => (
                            <Button
                                size={'sm'}
                                variant={'outline'}
                                className='ml-auto'
                                disabled={unfriendMutation.isLoading}
                                onClick={() =>
                                    unfriend({
                                        id: data.id
                                    })
                                }
                            >
                                <UserMinus /> Unfriend
                            </Button>
                        )}
                    />
                </TabsContent>
            </Tabs>
        </>
    )
}
