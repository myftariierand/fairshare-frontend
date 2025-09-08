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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

const GroupSchema = z.object({
    name: z.string().min(4, {
        message: 'Name must be at least 4 characters.'
    }),
    currency: z.string().min(1),
    cover: z.instanceof(File).optional()
})
type GroupData = z.infer<typeof GroupSchema>

type Props = {
    data: SingleGroup
}

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

const EditGroupSheet = ({ data }: Props) => {
    const [open, setOpen] = useState(false)
    const form = useForm<GroupData>({
        resolver: zodResolver(GroupSchema),
        defaultValues: {
            name: data.name,
            currency: data.currency
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
                                            placeholder={data.name}
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
                                        disabled
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
                        <FormField
                            control={form.control}
                            name='cover'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cover</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='file'
                                            onChange={e => {
                                                if (e.target.files?.length)
                                                    field.onChange(
                                                        e.target.files[0]
                                                    )
                                            }}
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
