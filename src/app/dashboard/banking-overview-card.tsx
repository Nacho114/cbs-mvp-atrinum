'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useCurrentAccount } from '@/app/dashboard/dashboard-state-provider'
import { formatValue } from '@/lib/utils'

const chartData = [
  { month: 'January', payment: 186 },
  { month: 'February', payment: 305 },
  { month: 'March', payment: 237 },
  { month: 'April', payment: 73 },
  { month: 'May', payment: 209 },
  { month: 'June', payment: 214 },
]

const chartConfig = {
  payment: {
    label: 'payment',
    color: 'hsl(var(--chart-1))',
  },
}

export default function BankingOverview() {
  const { currentAccount } = useCurrentAccount()
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatValue(currentAccount?.balance, currentAccount?.currency)}
              </div>
              <p className="text-xs text-muted-foreground">
                +20% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Net Outflows (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,345.00</div>
              <p className="text-xs text-muted-foreground">
                -5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Largest Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,200.00</div>
              <p className="text-xs text-muted-foreground">
                Rent payment on 15th
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="payment" fill="var(--color-payment)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Payments up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Total value of payments for the last 6 months
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
