'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, ShoppingBag, Store, TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    icon: DollarSign,
    change: "+20.1%",
    changeType: "increase",
    trend: [2800, 3200, 3500, 3700, 4200, 4500, 4800],
    description: "+20.1% from last month",
    tooltip: "Total revenue across all vendors and products",
    previousValue: "$37,651.12",
  },
  {
    title: "Active Vendors",
    value: "246",
    icon: Store,
    change: "+12",
    changeType: "increase",
    trend: [180, 195, 205, 220, 228, 235, 246],
    description: "+12 new vendors this month",
    tooltip: "Number of vendors currently active on the platform",
    previousValue: "234",
  },
  {
    title: "Total Orders",
    value: "2,345",
    icon: ShoppingBag,
    change: "+18.7%",
    changeType: "increase",
    trend: [1500, 1700, 1850, 1950, 2100, 2250, 2345],
    description: "+18.7% from last month",
    tooltip: "Total number of orders processed",
    previousValue: "1,975",
  },
  {
    title: "Total Customers",
    value: "12.5K",
    icon: Users,
    change: "+4.1%",
    changeType: "increase",
    trend: [10200, 10800, 11200, 11500, 11800, 12200, 12500],
    description: "+4.1% from last month",
    tooltip: "Total number of registered customers",
    previousValue: "12K",
  },
]

export function Overview() {
  return (
    <>
      {stats.map((stat) => (
        <TooltipProvider key={stat.title} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="transition-all hover:shadow-md overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1 text-sm ${stat.changeType === "increase" ? "text-green-500" : "text-red-500"
                          }`}
                      >
                        {stat.changeType === "increase" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {stat.change}
                      </div>
                      <span className="text-xs text-muted-foreground">{stat.description}</span>
                    </div>
                    <div className="h-[40px] -mx-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={stat.trend.map((value, i) => ({ value, name: i }))}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary)/.1)"
                            strokeWidth={1.5}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[250px]">
              <div className="space-y-2">
                <p className="font-medium">{stat.tooltip}</p>
                <div className="text-sm text-muted-foreground">Previous: {stat.previousValue}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  )
}

