import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { format } from 'date-fns'

import { useUpdateGroupMutation } from '@/app/services/group'

import { getErrorMessage } from '@/lib/utils'

import type { SingleGroup } from '@/types/group'

import { Loader, Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer'

const GroupSchema = z.object({
    name: z.string().min(4, {
        message: 'Name must be at least 4 characters.'
    })
})
type GroupData = z.infer<typeof GroupSchema>

type Props = {
    data: SingleGroup
}

const EditGroupSheet = ({ data }: Props) => {
    const [open, setOpen] = useState(false)
    const form = useForm<GroupData>({
        resolver: zodResolver(GroupSchema),
        defaultValues: {
            name: data.name
        }
    })

    const [updateGroup, { isLoading }] = useUpdateGroupMutation()

    const router = useRouter()

    const onSubmit = async (fields: GroupData) => {
        try {
            await updateGroup({ id: data.id, ...fields }).unwrap()
            setOpen(false)
            form.reset()
            toast.success('Group updated successfully')
            router.invalidate()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                    <Pencil />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>EDIT GROUP</DrawerTitle>
                    <DrawerDescription>
                        {data.name} | By {data.createdBy.name} at{' '}
                        {format(data.createdAt, 'dd MMM yy')}
                    </DrawerDescription>
                </DrawerHeader>
                <Form {...form}>
                    <form
                        id='group-form'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8 px-4'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Group Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={data.name}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DrawerFooter>
                    <Button form='group-form' type='submit' className='w-full'>
                        {isLoading ? (
                            <Loader className='animate-spin' />
                        ) : (
                            'Update'
                        )}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default EditGroupSheet
