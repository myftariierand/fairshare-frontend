import { createFileRoute } from '@tanstack/react-router'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GroupList from '@/components/group/group-list'
import CreateGroupDrawer from '@/components/group/create-group-drawer'
import GroupInvitesList from '@/components/group/group-invites-list'

export const Route = createFileRoute('/_auth/')({
    component: RouteComponent
})

function RouteComponent() {
    return (
        <>
            <header className='flex items-center py-3'>
                <h1 className='font-bold text-xl'>Groups</h1>
                <CreateGroupDrawer />
            </header>
            <Tabs defaultValue='groups'>
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
