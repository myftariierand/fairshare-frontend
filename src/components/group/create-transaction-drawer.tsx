import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { useCreateTransactionMutation } from '@/app/services/transaction'

import { getErrorMessage, formatAmount } from '@/lib/utils'

import type { Member } from '@/types/group'

import { Route } from '@/routes/_auth/$group'

import { ListPlus, Loader } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
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
import { ScrollArea } from '@/components/ui/scroll-area'

const TransactionSchema = z.object({
    description: z.string(),
    amount: z.string(),
    paidBy: z.string().uuid(),
    splits: z
        .object({
            name: z.string(),
            userId: z.string().uuid(),
            amount: z.string()
        })
        .array()
})
type TransactionData = z.infer<typeof TransactionSchema>

const CreateTransactionDrawer = ({ members }: { members: Member[] }) => {
    const [open, setOpen] = useState(false)
    const [splitEqually, setSplitEqually] = useState(true)

    const router = useRouter()

    const params = Route.useParams()
    const context = Route.useRouteContext()

    const form = useForm<TransactionData>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            description: '',
            amount: '',
            paidBy: context.user.id,
            splits: members.map(({ name, id }) => ({
                name,
                userId: id,
                amount: '0'
            }))
        }
    })
    const { fields } = useFieldArray({
        name: 'splits',
        control: form.control
    })

    const [createTransaction, { isLoading }] = useCreateTransactionMutation()

    const onSubmit = async (data: TransactionData) => {
        try {
            const transformedData = {
                ...data,
                amount: +data.amount,
                groupId: params.group,
                splits: data.splits.map(({ amount, userId }) => ({
                    userId,
                    amount: +amount
                }))
            }

            await createTransaction(transformedData).unwrap()
            setOpen(false)
            form.reset()
            toast.success('Transaction added successfully')
            router.invalidate()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const amount = form.watch('amount')

    useEffect(() => {
        const splits = form.getValues('splits')

        const updatedSplits = splits.map(split => ({
            ...split,
            amount:
                !amount || amount === '0'
                    ? '0'
                    : (+amount / members.length).toString()
        }))

        form.setValue('splits', updatedSplits)
    }, [amount, form, members, splitEqually])

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button size={'icon'} variant={'secondary'} className='ml-auto'>
                    <ListPlus />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>ADD A NEW TRANSACTION</DrawerTitle>
                    <DrawerDescription>
                        Create a transaction and share it with your group.
                    </DrawerDescription>
                </DrawerHeader>
                <ScrollArea className='overflow-y-auto'>
                    <Form {...form}>
                        <form
                            id='transaction-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 px-4'
                        >
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Plane Tickets'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='paidBy'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Paid By</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {members.map(member => (
                                                    <SelectItem
                                                        key={member.id}
                                                        value={member.id}
                                                    >
                                                        {member.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='amount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={formatAmount(600)}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                <div className='space-y-0.5'>
                                    <FormLabel className='text-base'>
                                        Split Equally
                                    </FormLabel>
                                    <FormDescription>
                                        Disable this if you want to manually
                                        specify the split amounts for each group
                                        member.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={splitEqually}
                                        onCheckedChange={setSplitEqually}
                                    />
                                </FormControl>
                            </FormItem>
                            {!splitEqually && (
                                <ul className='space-y-2'>
                                    {fields.map((split, index) => (
                                        <li key={split.id}>
                                            <FormField
                                                control={form.control}
                                                name={`splits.${index}.amount`}
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-row items-center justify-between space-y-0'>
                                                        <FormLabel className='text-base'>
                                                            {split.name}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className='w-auto'
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </form>
                    </Form>
                    <DrawerFooter>
                        <Button
                            form='transaction-form'
                            type='submit'
                            className='w-full'
                        >
                            {isLoading ? (
                                <Loader className='animate-spin' />
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </DrawerFooter>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateTransactionDrawer
