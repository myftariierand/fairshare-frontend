import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GroupList from '@/components/group/group-list'
import CreateGroupDrawer from '@/components/group/create-group-drawer'
import GroupInvitesList from '@/components/group/group-invites-list'

const TabSchema = z.enum(['groups', 'invites'])
type Tab = z.infer<typeof TabSchema>

const SearchSchema = z.object({
    t: z.enum(['groups', 'invites']).default('groups')
})

export const Route = createFileRoute('/_auth/')({
    validateSearch: SearchSchema,
    component: RouteComponent
})

function RouteComponent() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
        <>
            <header className='flex items-center py-3'>
                <h1 className='font-bold text-xl'>Groups</h1>
                <CreateGroupDrawer />
            </header>
            <Tabs
                value={search.t}
                onValueChange={value =>
                    navigate({ search: { t: value as Tab } })
                }
            >
                <TabsList className='w-full'>
                    <TabsTrigger value='groups' className='w-full'>
                        Groups
                    </TabsTrigger>
                    <TabsTrigger value='invites' className='w-full'>
                        Invites{' '}
                        {/* {!!data?.length && (
                            <Dot size={24} className='text-destructive' />
                        )} */}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='groups'>
                    <GroupList />
                </TabsContent>
                <TabsContent value='invites'>
                    <GroupInvitesList />
                </TabsContent>
            </Tabs>
        </>
    )
}
