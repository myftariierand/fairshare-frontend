import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { formatAmount } from '@/lib/utils'

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TransactionList from '@/components/group/transaction-list'
import DebtsList from '@/components/group/debts-list'
import { TransactionType } from '@/types/common'

const TabSchema = z.enum(['expenses', 'debts', 'balances'])
const SearchSchema = z.object({
    t: TabSchema.default('expenses'),
    name: z.string().optional(),
    price: z.number().optional(),
    drawer: z.boolean().optional()
})
type Tab = z.infer<typeof TabSchema>

export const Route = createFileRoute('/_auth/g/$group/')({
    validateSearch: SearchSchema,
    component: RouteComponent
})
import { Route as GroupLayout } from '@/routes/_auth/g/$group'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Balances from '@/components/group/balances'

function RouteComponent() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()
    const { user } = Route.useRouteContext()
    const group = GroupLayout.useLoaderData()

    const total = group.transactions
        .filter(transaction => transaction.type === TransactionType.expense)
        .reduce((acc, curr) => acc + +curr.amount, 0)

    const userShare = group.transactions
        .filter(
            transaction =>
                transaction.type === TransactionType.expense &&
                transaction.splits.some(split => split.userId === user.id)
        )
        .flatMap(transaction => transaction.splits)
        .filter(split => split.userId === user.id)
        .reduce((acc, split) => acc + split.amount, 0)

    function getGroupBalances() {
        // Get all group members so we include people with zero activity too
        const members = group.members

        // Pull all transactions with their splits
        const transactions = group.transactions

        // Initialize balance map at 0 for every member
        const balances = new Map<string, number>()
        for (const member of members) {
            balances.set(member.id, 0)
        }

        for (const tx of transactions) {
            const amount = Number(tx.amount)

            // Payer is credited the full amount they fronted
            balances.set(
                tx.paidBy.id,
                (balances.get(tx.paidBy.id) ?? 0) + amount
            )

            // Each split participant is debited their share
            for (const split of tx.splits) {
                const splitAmount = Number(split.amount)
                balances.set(
                    split.userId,
                    (balances.get(split.userId) ?? 0) - splitAmount
                )
            }
        }

        return members.map(member => ({
            id: member.id,
            name: member.name,
            email: member.email,
            balance: Math.round((balances.get(member.id) ?? 0) * 100) / 100
        }))
    }

    return (
        <>
            <div className='flex flex-col py-4 px-2 space-y-4'>
                <div className='flex gap-2'>
                    <Card className='flex-1'>
                        <CardHeader className='p-3'>
                            <CardDescription>Total Spent</CardDescription>
                            <CardTitle>
                                {formatAmount(total, group.currency)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className='flex-1'>
                        <CardHeader className='p-3'>
                            <CardDescription>Your Share</CardDescription>
                            <CardTitle>
                                {formatAmount(userShare, group.currency)}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className='p-3'>
                            <CardDescription>Expenses</CardDescription>
                            <CardTitle>{group.transactions.length}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                <Card>
                    <CardDescription className='p-3 flex flex-wrap gap-3'>
                        {getGroupBalances().map(({ id, name, balance }) => {
                            return (
                                <div
                                    key={id}
                                    className='flex items-center gap-2 min-w-[100px]'
                                >
                                    <Avatar className='size-8'>
                                        <AvatarFallback className='border'>
                                            {name.slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className='text-sm text-foreground leading-none'>
                                            {name.split(' ')[0]}
                                        </p>
                                        <p
                                            className={`text-xs font-mono font-bold mt-0.5 whitespace-nowrap ${balance > 0.01 ? 'text-success' : balance < -0.01 ? 'text-destructive' : 'text-muted-foreground'}`}
                                        >
                                            {formatAmount(
                                                balance,
                                                group.currency,
                                                'never'
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </CardDescription>
                </Card>
                <Tabs
                    value={search.t}
                    onValueChange={value =>
                        navigate({ search: { t: value as Tab }, replace: true })
                    }
                >
                    <TabsList className='w-full'>
                        <TabsTrigger value='expenses'>Expenses</TabsTrigger>
                        <TabsTrigger value='debts'>Settle Up</TabsTrigger>
                        <TabsTrigger value='balances'>Balances</TabsTrigger>
                    </TabsList>
                    <TabsContent value='expenses'>
                        <TransactionList />
                    </TabsContent>
                    <TabsContent value='debts'>
                        <DebtsList />
                    </TabsContent>
                    <TabsContent value='balances'>
                        <Balances />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
