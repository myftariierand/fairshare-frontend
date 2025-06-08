import { format } from 'date-fns'

import { Route as GroupLayout } from '@/routes/_auth/$group'

import { formatAmount } from '@/lib/utils'

import { Label, PieChart, Pie, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

import { Info } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

const chartConfig = {} satisfies ChartConfig

const Totals = () => {
    const group = GroupLayout.useLoaderData()
    const { user } = GroupLayout.useRouteContext()

    const total = group.transactions.reduce((acc, curr) => acc + curr.amount, 0)

    const userTransactions = group.transactions.filter(transaction => {
        const userIds = transaction.splits.map(split => split.userId)

        return userIds.includes(user.id)
    })

    const userTotal = userTransactions.reduce(
        (acc, curr) => acc + curr.amount,
        0
    )
    const userShare = userTotal / group.members.length

    const chartData = [
        { amount: userShare, fill: 'hsl(var(--muted-foreground))' },
        { amount: total - userShare, fill: 'hsl(var(--muted))' }
    ]

    return (
        <div className='space-y-4'>
            <Card className='flex flex-col'>
                <CardHeader className='items-center pb-0'>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>
                        {format(group.createdAt, 'dd MMMM yyyy')}
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex-1 pb-0'>
                    <ChartContainer
                        config={chartConfig}
                        className='mx-auto aspect-square w-full max-w-[300px]'
                    >
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey='amount'
                                innerRadius={90}
                                outerRadius={110}
                                activeIndex={0}
                                activeShape={({
                                    outerRadius = 0,
                                    ...props
                                }: PieSectorDataItem) => (
                                    <g>
                                        <Sector
                                            {...props}
                                            outerRadius={outerRadius}
                                        />
                                        <Sector
                                            {...props}
                                            outerRadius={outerRadius + 8}
                                            innerRadius={outerRadius + 3}
                                        />
                                    </g>
                                )}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (
                                            viewBox &&
                                            'cx' in viewBox &&
                                            'cy' in viewBox
                                        ) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor='middle'
                                                    dominantBaseline='middle'
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className='fill-foreground text-3xl font-bold'
                                                    >
                                                        {formatAmount(
                                                            total,
                                                            group.currency
                                                        )}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={
                                                            (viewBox.cy || 0) +
                                                            24
                                                        }
                                                        className='fill-muted-foreground'
                                                    >
                                                        Total
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className='flex-col gap-2 text-sm'>
                    <div className='text-muted-foreground leading-none'>
                        Showing total group spendings and your share
                    </div>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Total Spent</CardDescription>
                    <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                        {formatAmount(total, group.currency)}
                    </CardTitle>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                    <div className='text-muted-foreground flex items-center gap-1'>
                        <Info size={16} /> The total cost of every expense added
                        to the group
                    </div>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Your Share</CardDescription>
                    <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                        {formatAmount(userShare, group.currency)}
                    </CardTitle>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                    <div className='text-muted-foreground'>
                        {((userShare / total) * 100).toFixed(0)}% of total group
                        spending
                    </div>
                    <div className='text-muted-foreground flex items-center gap-1'>
                        <Info size={16} /> Your share of all group expenses
                        involving you
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Totals
