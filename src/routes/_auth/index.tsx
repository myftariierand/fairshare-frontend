import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { useGetGroupInvitesQuery } from '@/app/services/group'

import { GroupInviteStatus } from '@/types/common'

import { Dot } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GroupList from '@/components/group/group-list'
import CreateGroupDrawer from '@/components/group/create-group-drawer'
import GroupInvitesList from '@/components/group/group-invites-list'

const TabSchema = z.enum(['groups', 'invites'])
const SearchSchema = z.object({
    t: TabSchema.default('groups')
})
type Tab = z.infer<typeof TabSchema>

export const Route = createFileRoute('/_auth/')({
    validateSearch: SearchSchema,
    component: RouteComponent
})

function RouteComponent() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    const { data } = useGetGroupInvitesQuery({
        status: GroupInviteStatus.pending
    })

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
                        <span className='flex items-center relative'>
                            Invites
                            {!!data?.length && (
                                <Dot
                                    size={32}
                                    className='text-destructive absolute -left-6'
                                />
                            )}
                        </span>
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
