"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"
import { ChartToggle } from "@/components/ui/chart-toggle"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, TrendingUp } from "lucide-react"

const data = [
  {
    name: "iPhone 14 Pro",
    sales: 2450,
    revenue: 2940000,
    growth: 15,
    lastMonth: 2130,
    category: "Electronics",
  },
  {
    name: "MacBook Air M2",
    sales: 1890,
    revenue: 2362500,
    growth: 28,
    lastMonth: 1476,
    category: "Electronics",
  },
  {
    name: "AirPods Pro",
    sales: 3200,
    revenue: 798400,
    growth: -5,
    lastMonth: 3368,
    category: "Electronics",
  },
  {
    name: "Nike Air Max",
    sales: 2100,
    revenue: 378000,
    growth: 22,
    lastMonth: 1721,
    category: "Fashion",
  },
  {
    name: "Samsung S23",
    sales: 1750,
    revenue: 1750000,
    growth: 8,
    lastMonth: 1620,
    category: "Electronics",
  },
  {
    name: "iPad Air",
    sales: 1500,
    revenue: 749850,
    growth: -12,
    lastMonth: 1705,
    category: "Electronics",
  },
  {
    name: "Levi's 501",
    sales: 2800,
    revenue: 167720,
    growth: 18,
    lastMonth: 2373,
    category: "Fashion",
  },
  {
    name: "Sony WH-1000XM5",
    sales: 980,
    revenue: 379260,
    growth: 35,
    lastMonth: 726,
    category: "Electronics",
  },
]

interface TopProductsProps {
  className?: string
}

export function TopProducts({ className }: TopProductsProps) {
  const [chartType, setChartType] = useState("line")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(data.map((item) => item.category)))

  const filteredData = selectedCategory ? data.filter((item) => item.category === selectedCategory) : data

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 20, right: 20, left: 20, bottom: 20 },
    }

    const commonAxisProps = {
      stroke: "hsl(var(--muted-foreground))",
      fontSize: 12,
      tickLine: false,
      axisLine: false,
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
          <div className="rounded-lg border bg-background p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{label}</span>
              <Badge variant="secondary">{data.category}</Badge>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Sales</p>
                  <p className="font-medium">{formatNumber(data.sales)} units</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Revenue</p>
                  <p className="font-medium">{formatCurrency(data.revenue)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground uppercase">Growth</p>
                <div
                  className={cn("flex items-center gap-1 text-sm", data.growth > 0 ? "text-green-500" : "text-red-500")}
                >
                  {data.growth > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(data.growth)}%
                </div>
              </div>
            </div>
          </div>
        )
      }
      return null
    }

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis
              {...commonAxisProps}
              dataKey="name"
              tickFormatter={(value) => value.split(" ")[0]}
              height={60}
              angle={-45}
              textAnchor="end"
            />
            <YAxis {...commonAxisProps} yAxisId="left" tickFormatter={(value) => `${formatNumber(value)}`} />
            <YAxis
              {...commonAxisProps}
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              name="Sales (Units)"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: "var(--background)",
              }}
              className="stroke-primary fill-primary"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: "var(--background)",
              }}
              className="stroke-blue-500 fill-blue-500"
            />
          </LineChart>
        )
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis
              {...commonAxisProps}
              dataKey="name"
              tickFormatter={(value) => value.split(" ")[0]}
              height={60}
              angle={-45}
              textAnchor="end"
            />
            <YAxis {...commonAxisProps} tickFormatter={(value) => `${formatNumber(value)}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="sales"
              name="Current Sales"
              strokeWidth={2}
              className="fill-primary/20 stroke-primary"
            />
            <Area
              type="monotone"
              dataKey="lastMonth"
              name="Last Month"
              strokeWidth={2}
              className="fill-blue-500/20 stroke-blue-500"
            />
          </AreaChart>
        )
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis
              {...commonAxisProps}
              dataKey="name"
              tickFormatter={(value) => value.split(" ")[0]}
              height={60}
              angle={-45}
              textAnchor="end"
            />
            <YAxis {...commonAxisProps} tickFormatter={(value) => `${formatNumber(value)}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="sales" name="Sales (Units)" radius={[4, 4, 0, 0]} className="fill-primary/80" />
            <Bar dataKey="lastMonth" name="Last Month" radius={[4, 4, 0, 0]} className="fill-muted-foreground/30" />
          </BarChart>
        )
    }
  }

  return (
    <Card className={cn("transition-all hover:shadow-md w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Top Products</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-muted-foreground">Filter by category:</p>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        <ChartToggle value={chartType} onValueChange={(value) => value && setChartType(value)} />
      </CardHeader>
      <CardContent className="w-full px-0">
        <div className="h-[500px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

