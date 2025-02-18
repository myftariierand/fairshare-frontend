import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import {
    useUpdateTransactionMutation,
    type SingleTransaction
} from '@/app/services/transaction'

import { getErrorMessage, sanitizeNumberInput } from '@/lib/utils'

import { Route } from '@/routes/_auth/$group'

import { Loader, Pencil } from 'lucide-react'
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

const EditTransactionDrawer = ({
    transaction
}: {
    transaction: SingleTransaction
}) => {
    const [open, setOpen] = useState(false)
    const [splitEqually, setSplitEqually] = useState(
        transaction.splits.every(
            split =>
                split.amount === transaction.amount / transaction.splits.length
        )
    )

    const router = useRouter()
    const params = Route.useParams()

    const form = useForm<TransactionData>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            description: transaction.description,
            amount: transaction.amount.toString(),
            paidBy: transaction.paidById,
            splits: transaction.splits.map(({ amount, user }) => ({
                name: user.name,
                userId: user.id,
                amount: amount.toString()
            }))
        }
    })
    const { fields } = useFieldArray({
        name: 'splits',
        control: form.control
    })

    const [updateTransaction, { isLoading }] = useUpdateTransactionMutation()

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

            await updateTransaction({
                id: transaction.id,
                ...transformedData
            }).unwrap()
            setOpen(false)
            form.reset()
            toast.success('Transaction updated successfully')
            router.invalidate()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = sanitizeNumberInput(e.target.value)
        form.setValue('amount', amount)

        const updatedSplits = form.getValues('splits').map(split => ({
            ...split,
            amount:
                !amount || amount === '0'
                    ? '0'
                    : (+amount / transaction.splits.length).toString()
        }))

        form.setValue('splits', updatedSplits)
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open)
        form.reset({
            description: transaction.description,
            amount: transaction.amount.toString(),
            paidBy: transaction.paidById,
            splits: transaction.splits.map(({ amount, user }) => ({
                name: user.name,
                userId: user.id,
                amount: amount.toString()
            }))
        })
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
                <Button size={'icon'} variant={'secondary'}>
                    <Pencil />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>ADD A NEW TRANSACTION</DrawerTitle>
                    <DrawerDescription>
                        Create a transaction and share it with your group.
                    </DrawerDescription>
                </DrawerHeader>
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
                                            {transaction.splits.map(split => (
                                                <SelectItem
                                                    key={split.userId}
                                                    value={split.userId}
                                                >
                                                    {split.user.name}
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
                                            placeholder='$600'
                                            {...field}
                                            onChange={e => handleChange(e)}
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
                                    Disable this if you want to manually specify
                                    the split amounts for each group member.
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
                                                            onChange={e =>
                                                                field.onChange(
                                                                    sanitizeNumberInput(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
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
                            'Update'
                        )}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default EditTransactionDrawer
