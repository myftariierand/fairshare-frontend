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

import {
    getErrorMessage,
    formatAmount,
    sanitizeNumberInput,
    toMinorUnit,
    fromMinorUnit,
    parseNumberInput
} from '@/lib/utils'
import { transactionCategories } from '@/lib/get-transaction-icon'

import { Route } from '@/routes/_auth/g/$group'

import { Loader, Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const TransactionSchema = z.object({
    category: z.string(),
    description: z.string(),
    amount: z.string().refine(val => parseNumberInput(val) > 0, {
        message: 'Amount must be a positive number'
    }),
    paidBy: z.string().uuid(),
    splits: z
        .object({
            name: z.string(),
            userId: z.string().uuid(),
            amount: z.string().refine(val => parseNumberInput(val) > 0, {
                message: 'Amount must be a positive number'
            })
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
                Math.abs(
                    split.amount -
                        transaction.amount / transaction.splits.length
                ) <= 0.01
        )
    )

    const router = useRouter()
    const params = Route.useParams()
    const group = Route.useLoaderData()
    const context = Route.useRouteContext()

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

        const unitAmount = toMinorUnit(+amount, group.currency)
        const base = Math.floor(unitAmount / group.members.length)
        const remainder = unitAmount % group.members.length

        const updatedSplits = form.getValues('splits').map((split, i) => ({
            ...split,
            amount: fromMinorUnit(
                base + (i < remainder ? 1 : 0),
                group.currency
            )
        }))

        form.setValue('splits', updatedSplits)
    }

    const handleSplitEqually = (checked: boolean) => {
        setSplitEqually(checked)

        if (checked) {
            const amount = form.getValues('amount')
            const unitAmount = toMinorUnit(+amount, group.currency)
            const base = Math.floor(unitAmount / group.members.length)
            const remainder = unitAmount % group.members.length

            const updatedSplits = form.getValues('splits').map((split, i) => {
                return {
                    ...split,
                    amount: fromMinorUnit(
                        base + (i < remainder ? 1 : 0),
                        group.currency
                    )
                }
            })

            form.setValue('splits', updatedSplits)
        }
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open)
        form.reset({
            category: transaction.category ?? '',
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
                <Button variant={'default'}>
                    <Pencil /> Edit
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>EDIT EXPENSE</DrawerTitle>
                    <DrawerDescription>
                        Edit an expense and share it with your group.
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
                            name='category'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <ToggleGroup
                                        type='single'
                                        className='flex-wrap justify-start'
                                        value={field.value}
                                        onValueChange={value => {
                                            if (value) field.onChange(value)
                                        }}
                                    >
                                        {Object.entries(
                                            transactionCategories
                                        ).map(([value, { emoji, label }]) => (
                                            <ToggleGroupItem
                                                key={label}
                                                value={value}
                                                className='shrink-0 whitespace-nowrap grow'
                                                variant={'outline'}
                                                size={'sm'}
                                            >
                                                {emoji} {label}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </FormItem>
                            )}
                        />
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
                            name='amount'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={formatAmount(
                                                25,
                                                group.currency
                                            )}
                                            value={field.value || ''}
                                            onChange={e => handleChange(e)}
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
                                    <FormLabel>Paid By*</FormLabel>
                                    <ToggleGroup
                                        type='single'
                                        className='flex-wrap justify-start'
                                        value={field.value}
                                        onValueChange={value => {
                                            if (value) field.onChange(value)
                                        }}
                                    >
                                        {[...group.members]
                                            .sort(a =>
                                                a.id === context.user.id
                                                    ? -1
                                                    : 1
                                            )
                                            .map(member => (
                                                <ToggleGroupItem
                                                    key={member.id}
                                                    value={member.id}
                                                    className='shrink-0 whitespace-nowrap'
                                                    variant={'outline'}
                                                >
                                                    <Avatar className='size-5'>
                                                        <AvatarFallback className='border text-xs'>
                                                            {member.name.slice(
                                                                0,
                                                                2
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {context.user.id ===
                                                    member.id
                                                        ? 'You'
                                                        : member.name}
                                                </ToggleGroupItem>
                                            ))}
                                    </ToggleGroup>
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
                                    onCheckedChange={handleSplitEqually}
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
