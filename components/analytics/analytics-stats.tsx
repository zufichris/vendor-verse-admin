"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Store } from "lucide-react"
import { AnalyticsStatsSkeleton } from "./analytics-skeleton"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "increase",
    icon: DollarSign,
  },
  {
    title: "Total Orders",
    value: "2,345",
    change: "+15.2%",
    changeType: "increase",
    icon: ShoppingCart,
  },
  {
    title: "New Customers",
    value: "432",
    change: "-5.4%",
    changeType: "decrease",
    icon: Users,
  },
  {
    title: "Active Vendors",
    value: "12",
    change: "+12.3%",
    changeType: "increase",
    icon: Store,
  },
]

export function AnalyticsStats() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <AnalyticsStatsSkeleton />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2">
              {stat.changeType === "increase" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <p className={`text-sm ${stat.changeType === "increase" ? "text-green-500" : "text-red-500"}`}>
                {stat.change}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

