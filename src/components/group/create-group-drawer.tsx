import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { useCreateGroupMutation } from '@/app/services/group'

import { getErrorMessage } from '@/lib/utils'

import { Loader, Users } from 'lucide-react'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { useGroupDrawerContext } from './create-group-drawer-context'

const GroupSchema = z.object({
    name: z.string().min(4, {
        message: 'Name must be at least 4 characters.'
    }),
    currency: z.string().min(1)
})
type GroupData = z.infer<typeof GroupSchema>

const currencyOptions = [
    { code: 'EUR', name: 'Euro' },
    { code: 'ALL', name: 'Albanian Lek' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' }
]

const CreateGroupSheet = () => {
    const { open, setOpen } = useGroupDrawerContext()

    const form = useForm<GroupData>({
        resolver: zodResolver(GroupSchema),
        defaultValues: {
            name: ''
        }
    })

    const [createGroup, { isLoading }] = useCreateGroupMutation()

    const onSubmit = async (data: GroupData) => {
        try {
            await createGroup(data).unwrap()
            setOpen(false)
            form.reset()
            toast.success('Group created successfully')
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open)
        form.reset({ name: '' })
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
                <Button size={'sm'} variant={'outline'}>
                    <Users /> New Group
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>CREATE A NEW GROUP</DrawerTitle>
                    <DrawerDescription>
                        Create a group and invite friends for your future trip.
                    </DrawerDescription>
                </DrawerHeader>
                <Form {...form}>
                    <form
                        id='group-form'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 px-4'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Group Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Summer 2024 Trip'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='currency'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select currency' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {currencyOptions.map(currency => (
                                                <SelectItem
                                                    key={currency.code}
                                                    value={currency.code}
                                                >
                                                    {currency.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                            'Create'
                        )}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateGroupSheet
