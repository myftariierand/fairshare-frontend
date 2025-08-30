import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { type VariantProps } from 'class-variance-authority'

import { useCreateTransactionMutation } from '@/app/services/transaction'

import {
    getErrorMessage,
    formatAmount,
    sanitizeNumberInput,
    toMinorUnit,
    fromMinorUnit
} from '@/lib/utils'

import { Route } from '@/routes/_auth/$group'

import { Loader, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
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
import SplitsCard from '@/components/group/create-transaction-drawer/splits-card'

const TransactionSchema = z.object({
    description: z.string().min(3, 'Must be at least 3 characters long.'),
    amount: z.number().positive(),
    paidBy: z.string().uuid(),
    splits: z
        .object({
            name: z.string(),
            userId: z.string().uuid(),
            amount: z
                .number()
                .positive()
                .transform(val => Math.round(val * 100) / 100)
        })
        .array()
})
export type TransactionData = z.infer<typeof TransactionSchema>

type Props = {
    triggerLabel?: string
    triggerVariants?: VariantProps<typeof buttonVariants>
}

const CreateTransactionDrawer = (props: Props) => {
    const [open, setOpen] = useState(false)
    const [splitEqually, setSplitEqually] = useState(true)

    const router = useRouter()

    const params = Route.useParams()
    const context = Route.useRouteContext()
    const group = Route.useLoaderData()

    const form = useForm<TransactionData>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            description: '',
            amount: 0,
            paidBy: context.user.id,
            splits: group.members.map(({ name, id }) => ({
                name,
                userId: id,
                amount: 0
            }))
        }
    })

    const [createTransaction, { isLoading }] = useCreateTransactionMutation()

    const onSubmit = async (data: TransactionData) => {
        try {
            const transformedData = { groupId: params.group, ...data }
            await createTransaction(transformedData).unwrap()
            setOpen(false)
            form.reset()
            toast.success('Transaction added successfully')
            router.invalidate()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = sanitizeNumberInput(e.target.value)
        form.setValue('amount', amount)

        const unitAmount = toMinorUnit(amount, group.currency)
        const base = Math.floor(unitAmount / group.members.length)
        const remainder = unitAmount % group.members.length

        const updatedSplits = form.getValues('splits').map((split, i) => ({
            ...split,
            amount: +fromMinorUnit(
                base + (i < remainder ? 1 : 0),
                group.currency
            )
        }))

        form.setValue('splits', updatedSplits)
    }

    const handleSplitEqually = (checked: boolean) => {
        const amount = form.getValues('amount')

        if (!(amount > 0)) {
            toast.info('Enter a cost for your expense first')
            return
        }

        setSplitEqually(checked)

        if (checked) {
            const unitAmount = toMinorUnit(amount, group.currency)
            const base = Math.floor(unitAmount / group.members.length)
            const remainder = unitAmount % group.members.length

            const updatedSplits = form.getValues('splits').map((split, i) => {
                return {
                    ...split,
                    amount: +fromMinorUnit(
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
        setSplitEqually(true)
        form.reset({
            description: '',
            amount: 0,
            paidBy: context.user.id,
            splits: group.members.map(({ name, id }) => ({
                name,
                userId: id,
                amount: 0
            }))
        })
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
                <Button {...props.triggerVariants}>
                    <Plus /> {props.triggerLabel}
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
                                        <FormLabel>Description*</FormLabel>
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
                                        <FormLabel>Total Amount*</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                inputMode='decimal'
                                                placeholder={formatAmount(
                                                    600,
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
                                                {group.members.map(member => (
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
                                        onCheckedChange={handleSplitEqually}
                                    />
                                </FormControl>
                            </FormItem>
                            {!splitEqually && <SplitsCard />}
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
