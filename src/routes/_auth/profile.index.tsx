import { createFileRoute, Link } from '@tanstack/react-router'
import { format } from 'date-fns'

import type { Group, Profile, User } from '@/types/user'

import {
    Mail,
    CalendarDays,
    Users,
    Chrome,
    UserCheck,
    ChevronRight,
    CreditCard,
    LucideIcon
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { formatAmount } from '@/lib/utils'

export const Route = createFileRoute('/_auth/profile/')({
    component: RouteComponent
})

function RouteComponent() {
    const { user } = Route.useRouteContext()

    const transactions = user.groups.flatMap(group => group.transactions)
    const involvedTransactions = transactions.filter(transactions =>
        transactions.splits.some(split => split.userId === user.id)
    ).length

    return (
        <div>
            <div className='px-2 py-6'>
                <div className='flex flex-col gap-5'>
                    <ProfileHeader user={user} />
                    <BalanceTicket
                        currentUserId={user.id}
                        transactions={transactions}
                    />
                    <div className='grid grid-cols-3 space-x-2'>
                        <StatChip
                            icon={Users}
                            value={user.groups.length}
                            label='Groups'
                        />
                        <StatChip
                            icon={UserCheck}
                            value={user.friends.length}
                            label='Friends'
                        />
                        <StatChip
                            icon={CreditCard}
                            value={involvedTransactions}
                            label='Transactions'
                        />
                    </div>
                    <Tabs defaultValue='groups'>
                        <TabsList>
                            {[
                                ['groups', 'Groups'],
                                ['friends', 'Friends']
                            ].map(([val, label]) => (
                                <TabsTrigger key={val} value={val}>
                                    {label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value='groups'>
                            <GroupsTab groups={user.groups} />
                        </TabsContent>
                        <TabsContent value='friends'>
                            <FriendsTab friends={user.friends} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

function tornEdgePath(teeth = 26, depth = 55) {
    const pts = ['0% 0%', '100% 0%']
    for (let i = 0; i <= teeth; i++) {
        const x = 100 - (i / teeth) * 100
        const y = i % 2 === 0 ? 100 : 100 - depth
        pts.push(`${x}% ${y}%`)
    }
    return `polygon(${pts.join(',')})`
}
const TORN = tornEdgePath(26, 55)

/* ---------------------------------------------------------
   SECTIONS
--------------------------------------------------------- */
function ProfileHeader({ user }: { user: User }) {
    const initials = user.name
        .split(' ')
        .map(s => s[0])
        .join('')
    const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    })
    return (
        <Card>
            <CardContent className='pt-6 flex flex-wrap items-start justify-between gap-4'>
                <div className='flex gap-4 items-center'>
                    <Avatar className='h-14 w-14 border'>
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className=''>
                        <h1 className='text-xl font-semibold mb-2'>
                            {user.name}
                        </h1>
                        <div className='space-y-2 text-xs '>
                            <span className='flex items-center gap-1.5'>
                                <Mail size={12} /> {user.email}
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <CalendarDays size={12} /> Member since{' '}
                                {memberSince}
                            </span>
                            {user.provider === 'google' && (
                                <span className='flex items-center gap-1.5'>
                                    <Chrome size={12} /> Signed in with Google
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <Button asChild size={'sm'} variant={'outline'}>
                    <Link to='/profile/settings'>Edit profile</Link>
                </Button>
            </CardContent>
        </Card>
    )
}

function computeBalances(
    currentUserId: string,
    transactions: Group['transactions']
): Balances {
    const pairwise: Record<string, number> = {}

    for (const txn of transactions) {
        const { paidById, splits } = txn

        for (const split of splits) {
            if (split.userId === paidById) continue // payer's own share isn't a debt

            const amount = Number(split.amount)

            if (paidById === currentUserId) {
                // split.userId owes me `amount` (or, for a settlement recorded as
                // a reverse entry, this cancels what I previously owed them).
                pairwise[split.userId] = (pairwise[split.userId] ?? 0) + amount
            } else if (split.userId === currentUserId) {
                // I owe paidById `amount` (or this cancels what they owed me).
                pairwise[paidById] = (pairwise[paidById] ?? 0) - amount
            }
        }
    }

    let owedToYou = 0
    let youOwe = 0
    for (const amount of Object.values(pairwise)) {
        if (amount > 0) owedToYou += amount
        else youOwe += Math.abs(amount)
    }

    return {
        net: owedToYou - youOwe,
        owedToYou,
        youOwe,
        pairwise
    }
}
interface Balances {
    net: number
    owedToYou: number
    youOwe: number
    pairwise: Record<string, number> // otherUserId -> amount they owe you (negative = you owe them)
}

function computeBalancesByCurrency(
    currentUserId: string,
    transactions: Group['transactions']
): Record<string, Balances> {
    const byCurrency: Record<string, Group['transactions']> = {}
    for (const txn of transactions) {
        const currency = txn.group.currency
        ;(byCurrency[currency] ??= []).push(txn)
    }

    const result: Record<string, Balances> = {}
    for (const [currency, txns] of Object.entries(byCurrency)) {
        result[currency] = computeBalances(currentUserId, txns)
    }
    return result
}

function BalanceTicket({
    currentUserId,
    transactions
}: {
    currentUserId: string
    transactions: Group['transactions']
}) {
    const balancesByCurrency = computeBalancesByCurrency(
        currentUserId,
        transactions
    )
    const currencies = Object.keys(balancesByCurrency)

    return (
        <div className='relative'>
            <Card className='rounded-b-none border-b-0'>
                <CardContent className='p-6 pb-5 flex flex-wrap justify-between gap-4'>
                    {currencies.map((currency, index) => {
                        const { net, owedToYou, youOwe } =
                            balancesByCurrency[currency]
                        const positive = net >= 0

                        return (
                            <div key={currency}>
                                <div className='flex flex-wrap justify-between gap-4'>
                                    <div>
                                        <div
                                            className='uppercase text-[10px] font-mono'
                                            style={{
                                                letterSpacing: '0.14em'
                                            }}
                                        >
                                            Net balance · {currency}
                                        </div>
                                        <div className='font-semibold mt-1.5 leading-none'>
                                            {formatAmount(net, currency)}
                                        </div>
                                        <div className='text-xs mt-2'>
                                            {positive
                                                ? "You're owed more than you owe in this currency"
                                                : "You owe more than you're owed in this currency"}
                                        </div>
                                    </div>
                                    <div className='text-xs space-y-1 font-mono'>
                                        <div>
                                            owed to you{' '}
                                            <span className='text-success'>
                                                {formatAmount(
                                                    owedToYou,
                                                    currency
                                                )}
                                            </span>
                                        </div>
                                        <div>
                                            you owe{' '}
                                            <span className='text-destructive'>
                                                {formatAmount(youOwe, currency)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {index < currencies.length - 1 && <Separator />}
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
            <div
                className='h-4 bg-card border border-t-0'
                style={{ clipPath: TORN }}
            />
        </div>
    )
}

function StatChip({
    icon: Icon,
    value,
    label
}: {
    icon: LucideIcon
    value: number
    label: string
}) {
    return (
        <Card>
            <CardContent className='p-4 flex items-center gap-3'>
                <Icon size={16} />
                <div>
                    <div className='text-lg leading-none font-mono'>
                        {value}
                    </div>
                    <div className='text-xs mt-1'>{label}</div>
                </div>
            </CardContent>
        </Card>
    )
}

function GroupsTab({ groups }: { groups: Profile['groups'] }) {
    return (
        <Card>
            <CardContent className='pb-0'>
                {groups.map((g, i) => (
                    <Link key={g.id} to='/g/$group' params={{ group: g.id }}>
                        <div className='flex items-center gap-3 py-3.5'>
                            {/* <Image/> */}
                            <div className='flex-1'>
                                <div className='text-sm'>{g.name}</div>
                                <div className='text-[10.5px] mt-0.5 font-mono'>
                                    {g.members.length} members ·{' '}
                                    {format(g.createdAt, 'MMM dd, yyyy')}
                                </div>
                            </div>
                            <ChevronRight size={15} />
                        </div>
                        {i < groups.length - 1 && <Separator />}
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}

function FriendsTab({ friends }: { friends: Profile['friends'] }) {
    return (
        <Card>
            <CardContent className='p-4 py-0'>
                {friends.map((f, i) => {
                    const initials = f.name
                        .split(' ')
                        .map(s => s[0])
                        .join('')
                    return (
                        <div key={f.email}>
                            <div className='flex items-center gap-3 py-3'>
                                <Avatar>
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                    <div className='text-sm'>{f.name}</div>
                                    <div className='text-xs mt-0.5 font-mono'>
                                        {f.email}
                                    </div>
                                </div>
                                <div className='text-xs'>
                                    Since {format(f.updatedAt, 'MMM dd, yyyy')}
                                </div>
                            </div>
                            {i < friends.length - 1 && <Separator />}
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
