import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TransactionList from '@/components/group/transaction-list'
import DebtsList from '@/components/group/debts-list'
import Totals from '@/components/group/totals'

const TabSchema = z.enum(['expenses', 'debts', 'totals'])
const SearchSchema = z.object({
  t: TabSchema.default('expenses'),
  name: z.string().optional(),
  price: z.number().optional(),
})
type Tab = z.infer<typeof TabSchema>

export const Route = createFileRoute('/_auth/g/$group/')({
  validateSearch: SearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <>
      <div className="flex flex-col p-2">
        <Tabs
          value={search.t}
          onValueChange={(value) =>
            navigate({ search: { t: value as Tab }, replace: true })
          }
        >
          <div className="flex items-center">
            <TabsList className="mr-auto">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="debts">Debts</TabsTrigger>
              <TabsTrigger value="totals">Totals</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="expenses">
            <TransactionList />
          </TabsContent>
          <TabsContent value="debts">
            <DebtsList />
          </TabsContent>
          <TabsContent value="totals">
            <Totals />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
