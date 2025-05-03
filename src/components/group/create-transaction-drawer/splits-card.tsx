import { useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { cn, formatAmount, sanitizeNumberInput } from '@/lib/utils'

import type { CheckedState } from '@radix-ui/react-checkbox'
import type { TransactionData } from '@/components/group/create-transaction-drawer'

import { Route } from '@/routes/_auth/$group'

import { Member } from '@/types/group'

import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const SplitsCard = () => {
    const [splitType, setSplitType] = useState('equally')

    const group = Route.useLoaderData()
    const form = useFormContext<TransactionData>()
    const { fields: splits, replace } = useFieldArray({
        name: 'splits',
        control: form.control
    })
    const amount = form.getValues('amount')

    const handleTabChange = (value: string) => {
        setSplitType(value)

        const evenAmount = +(amount / group.members.length).toFixed(2)
        const updatedSplits = group.members.map(member => ({
            name: member.name,
            userId: member.id,
            amount: evenAmount
        }))

        replace(updatedSplits)
    }

    const handleCheckboxChange = (checked: CheckedState, member: Member) => {
        let updatedSplits: TransactionData['splits']

        if (!checked) {
            if (splits.length === 1) {
                toast.error('You must have at least one member selected')
                return
            }

            updatedSplits = splits.filter(split => split.userId !== member.id)
        } else {
            updatedSplits = [
                ...splits,
                {
                    userId: member.id,
                    name: member.name,
                    amount: 0
                }
            ]
        }

        const evenAmount = +(amount / updatedSplits.length).toFixed(2)

        updatedSplits = updatedSplits.map(split => ({
            ...split,
            amount: evenAmount
        }))

        replace(updatedSplits)
    }

    const membersIds = splits.map(split => split.userId)
    const splitsAmount = form
        .watch('splits')
        .reduce((acc, curr) => acc + curr.amount, 0)
    const remainingAmount = amount - splitsAmount
    const amountError = splitsAmount > amount

    return (
        <Tabs value={splitType} onValueChange={handleTabChange}>
            <TabsList className='w-full'>
                <TabsTrigger value='equally' className='w-full'>
                    Equally
                </TabsTrigger>
                <TabsTrigger value='amount' className='w-full'>
                    By Amount
                </TabsTrigger>
            </TabsList>
            <TabsContent value='equally'>
                <Card className='shadow-none rounded-lg'>
                    <CardHeader>
                        <CardTitle>
                            {formatAmount(
                                amount / splits.length,
                                group.currency
                            )}
                            &nbsp;/&nbsp;person
                        </CardTitle>
                        <CardDescription>
                            {splits.length} people
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className='space-y-2'>
                            {group.members.map(member => (
                                <li key={member.id}>
                                    <FormItem className='flex justify-between items-center space-y-0 border-b pb-2 h-9'>
                                        <FormLabel className='text-base'>
                                            {member.name}
                                        </FormLabel>
                                        <FormControl>
                                            <Checkbox
                                                checked={membersIds.includes(
                                                    member.id
                                                )}
                                                onCheckedChange={checked =>
                                                    handleCheckboxChange(
                                                        checked,
                                                        member
                                                    )
                                                }
                                            />
                                        </FormControl>
                                    </FormItem>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value='amount'>
                <Card className='shadow-none rounded-lg'>
                    <CardHeader>
                        <CardTitle
                            className={cn(amountError && 'text-destructive')}
                        >
                            {formatAmount(splitsAmount, group.currency)}
                            &nbsp;of&nbsp;
                            {formatAmount(amount, group.currency)}
                        </CardTitle>
                        <CardDescription
                            className={cn(amountError && 'text-destructive')}
                        >
                            {formatAmount(remainingAmount, group.currency)}{' '}
                            remaining
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className='space-y-2'>
                            {splits.map((member, index) => (
                                <li key={member.id}>
                                    <FormField
                                        control={form.control}
                                        name={`splits.${index}.amount`}
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-center justify-between space-y-0'>
                                                <FormLabel className='text-base flex-1'>
                                                    {member.name}
                                                </FormLabel>
                                                <span className='mr-2 text-sm font-medium'>
                                                    {group.currency}
                                                </span>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className='w-1/4 text-end'
                                                        placeholder={formatAmount(
                                                            300,
                                                            group.currency
                                                        )}
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
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

export default SplitsCard
