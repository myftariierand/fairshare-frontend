import { useEffect, useState } from 'react'
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
    fromMinorUnit,
    parseNumberInput
} from '@/lib/utils'
import { transactionCategories } from '@/lib/get-transaction-icon'

import { Route } from '@/routes/_auth/g/$group'
import { Route as GroupRoute } from '@/routes/_auth/g/$group/index'

import { Loader, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import SplitsCard from '@/components/group/create-transaction-drawer/splits-card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const TransactionSchema = z.object({
    category: z.string(),
    description: z.string().min(4, 'Must be at least 4 characters long.'),
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
    const search = GroupRoute.useSearch()
    const navigate = GroupRoute.useNavigate()

    const form = useForm<TransactionData>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            category: 'OTHER',
            description: '',
            amount: '',
            paidBy: context.user.id,
            splits: group.members.map(({ name, id }) => ({
                name,
                userId: id,
                amount: ''
            }))
        }
    })

    const [createTransaction, { isLoading }] = useCreateTransactionMutation()

    const onSubmit = async (data: TransactionData) => {
        try {
            const transformedData = {
                ...data,
                groupId: params.group,
                amount: parseNumberInput(data.amount),
                splits: data.splits.map(split => ({
                    ...split,
                    amount: +split.amount
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amount = sanitizeNumberInput(e.target.value)
        form.setValue('amount', amount)

        const selectedGroupedMembers = form.getValues('splits').length

        const unitAmount = toMinorUnit(+amount, group.currency)
        const base = Math.floor(unitAmount / selectedGroupedMembers)
        const remainder = unitAmount % selectedGroupedMembers

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
        const amount = form.getValues('amount')

        if (!(+amount > 0)) {
            toast.info('Enter a cost for your expense first')
            return
        }

        setSplitEqually(checked)

        if (checked) {
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
        setSplitEqually(true)
        form.reset({
            category: 'OTHER',
            description: '',
            amount: '',
            paidBy: context.user.id,
            splits: group.members.map(({ name, id }) => ({
                name,
                userId: id,
                amount: ''
            }))
        })
        navigate({
            to: '.',
            search: prev => ({
                ...prev,
                name: undefined,
                price: undefined
            }),
            replace: true
        })
    }

    const { name, price } = search

    useEffect(() => {
        if (!name || !price) return

        const unitAmount = toMinorUnit(+price, group.currency)
        const base = Math.floor(unitAmount / group.members.length)
        const remainder = unitAmount % group.members.length
        const splits = form.getValues('splits').map((split, i) => {
            return {
                ...split,
                amount: fromMinorUnit(
                    base + (i < remainder ? 1 : 0),
                    group.currency
                )
            }
        })

        form.reset({
            category: 'OTHER',
            description: name,
            amount: price.toString(),
            paidBy: context.user.id,
            splits
        })
        setOpen(true)
    }, [name, price])

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
                <Button
                    {...props.triggerVariants}
                    className='fixed right-4'
                    style={{
                        bottom: `calc(5rem + env(safe-area-inset-bottom))`
                    }}
                >
                    <Plus /> {props.triggerLabel}
                </Button>
            </DrawerTrigger>
            <DrawerContent className='h-full max-h-[90dvh]'>
                <DrawerHeader>
                    <DrawerTitle>NEW EXPENSE</DrawerTitle>
                    <DrawerDescription>
                        Add an expense and share it with this group.
                    </DrawerDescription>
                </DrawerHeader>
                <ScrollArea>
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
                                            className='flex-col'
                                            value={field.value}
                                            onValueChange={value => {
                                                if (value) field.onChange(value)
                                            }}
                                        >
                                            <div className='flex flex-wrap justify-start gap-1'>
                                                {Object.entries(
                                                    transactionCategories
                                                )
                                                    .slice(0, 10)
                                                    .map(
                                                        ([
                                                            value,
                                                            { emoji, label }
                                                        ]) => (
                                                            <ToggleGroupItem
                                                                key={label}
                                                                value={value}
                                                                className='shrink-0 whitespace-nowrap grow'
                                                                variant={
                                                                    'outline'
                                                                }
                                                                size={'sm'}
                                                            >
                                                                {emoji} {label}
                                                            </ToggleGroupItem>
                                                        )
                                                    )}
                                            </div>
                                            <Collapsible className='grow'>
                                                <CollapsibleContent className='flex flex-wrap gap-1'>
                                                    {Object.entries(
                                                        transactionCategories
                                                    )
                                                        .slice(10)
                                                        .map(
                                                            ([
                                                                value,
                                                                { emoji, label }
                                                            ]) => (
                                                                <ToggleGroupItem
                                                                    key={label}
                                                                    value={
                                                                        value
                                                                    }
                                                                    className='shrink-0 whitespace-nowrap grow'
                                                                    variant={
                                                                        'outline'
                                                                    }
                                                                    size={'sm'}
                                                                >
                                                                    {emoji}{' '}
                                                                    {label}
                                                                </ToggleGroupItem>
                                                            )
                                                        )}
                                                </CollapsibleContent>
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant={'link'}
                                                        className='w-full'
                                                    >
                                                        More Categories
                                                    </Button>
                                                </CollapsibleTrigger>
                                            </Collapsible>
                                        </ToggleGroup>
                                    </FormItem>
                                )}
                            />
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
                </ScrollArea>
                <DrawerFooter className='p-[max(env(safe-area-inset-bottom,0px),16px)]'>
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
            </DrawerContent>
        </Drawer>
    )
}

export default CreateTransactionDrawer
