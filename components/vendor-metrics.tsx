"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChartToggle } from "@/components/ui/chart-toggle"
import { Badge } from "@/components/ui/badge"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"

const vendors = [
  {
    name: "Tech Gadgets Inc",
    sales: 12450,
    orders: 145,
    rating: 4.8,
    growth: 15,
    trend: [4200, 4500, 4800, 4600, 5100, 5200, 5500],
    category: "Electronics",
  },
  {
    name: "Fashion Hub",
    sales: 9876,
    orders: 98,
    rating: 4.6,
    growth: 8,
    trend: [3200, 3400, 3600, 3800, 4000, 4200, 4400],
    category: "Fashion",
  },
  {
    name: "Home Essentials",
    sales: 8654,
    orders: 76,
    rating: 4.7,
    growth: 12,
    trend: [2800, 3000, 3200, 3400, 3600, 3800, 4000],
    category: "Home",
  },
  {
    name: "Organic Foods",
    sales: 7234,
    orders: 65,
    rating: 4.9,
    growth: -5,
    trend: [2400, 2600, 2800, 3000, 3200, 3400, 3600],
    category: "Food",
  },
  {
    name: "Sports Gear Pro",
    sales: 6543,
    orders: 54,
    rating: 4.5,
    growth: 20,
    trend: [2000, 2200, 2400, 2600, 2800, 3000, 3200],
    category: "Sports",
  },
]

const processedData = vendors[0].trend.map((_, index) => ({
  name: `Week ${index + 1}`,
  ...vendors.reduce(
    (acc, vendor) => ({
      ...acc,
      [vendor.name]: vendor.trend[index],
    }),
    {},
  ),
}))

interface VendorMetricsProps {
  className?: string
}

export function VendorMetrics({ className }: VendorMetricsProps) {
  const [chartType, setChartType] = useState("line")
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(vendors.map((item) => item.category)))
  const filteredVendors = selectedCategory ? vendors.filter((vendor) => vendor.category === selectedCategory) : vendors

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderChart = () => {
    const commonProps = {
      data: processedData,
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
        return (
          <div className="rounded-lg border bg-background p-4 shadow-xl">
            <p className="mb-2 font-semibold">Week {label.split(" ")[1]}</p>
            <div className="grid gap-2">
              {payload.map((entry: any, index: number) => {
                const vendor = vendors.find((v) => v.name === entry.name)
                if (!vendor) return null
                return (
                  <div key={entry.name} className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: `hsl(${index * 50}, 70%, 50%)` }}
                      />
                      <span className="font-medium">{entry.name}</span>
                      <Badge variant="secondary">{vendor.category}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pl-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Sales</p>
                        <p className="font-medium">{formatNumber(entry.value)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Growth</p>
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            vendor.growth > 0 ? "text-green-500" : "text-red-500",
                          )}
                        >
                          {vendor.growth > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {Math.abs(vendor.growth)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
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
            <XAxis {...commonAxisProps} dataKey="name" />
            <YAxis {...commonAxisProps} tickFormatter={(value) => formatNumber(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {filteredVendors.map((vendor, index) => (
              <Line
                key={vendor.name}
                type="monotone"
                dataKey={vendor.name}
                name={vendor.name}
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "var(--background)",
                }}
                stroke={`hsl(${index * 50}, 70%, 50%)`}
                style={{
                  opacity: selectedVendor ? (selectedVendor === vendor.name ? 1 : 0.2) : 1,
                }}
              />
            ))}
          </LineChart>
        )
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis {...commonAxisProps} dataKey="name" />
            <YAxis {...commonAxisProps} tickFormatter={(value) => formatNumber(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {filteredVendors.map((vendor, index) => (
              <Area
                key={vendor.name}
                type="monotone"
                dataKey={vendor.name}
                name={vendor.name}
                strokeWidth={2}
                fill={`hsl(${index * 50}, 70%, 50%)`}
                stroke={`hsl(${index * 50}, 70%, 50%)`}
                fillOpacity={0.2}
                style={{
                  opacity: selectedVendor ? (selectedVendor === vendor.name ? 1 : 0.2) : 1,
                }}
              />
            ))}
          </AreaChart>
        )
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis {...commonAxisProps} dataKey="name" />
            <YAxis {...commonAxisProps} tickFormatter={(value) => formatNumber(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {filteredVendors.map((vendor, index) => (
              <Bar
                key={vendor.name}
                dataKey={vendor.name}
                name={vendor.name}
                radius={[4, 4, 0, 0]}
                fill={`hsl(${index * 50}, 70%, 50%)`}
                style={{
                  opacity: selectedVendor ? (selectedVendor === vendor.name ? 1 : 0.2) : 1,
                }}
              />
            ))}
          </BarChart>
        )
    }
  }

  return (
    <Card className={cn("transition-all hover:shadow-md w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Top Performing Vendors</CardTitle>
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
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        <div className="mt-4 w-full px-4 sm:px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Orders</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor, index) => (
                <TableRow
                  key={vendor.name}
                  className="cursor-pointer hover:bg-muted/50"
                  onMouseEnter={() => setSelectedVendor(vendor.name)}
                  onMouseLeave={() => setSelectedVendor(null)}
                  style={{
                    opacity: selectedVendor ? (selectedVendor === vendor.name ? 1 : 0.6) : 1,
                  }}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: `hsl(${index * 50}, 70%, 50%)` }}
                      />
                      <span>{vendor.name}</span>
                      <Badge variant="secondary">{vendor.category}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${vendor.sales.toLocaleString()}</TableCell>
                  <TableCell className="hidden sm:table-cell text-right">{vendor.orders}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span>{vendor.rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <div
                        className={cn(
                          "flex items-center gap-1 text-xs",
                          vendor.growth > 0 ? "text-green-500" : "text-red-500",
                        )}
                      >
                        {vendor.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(vendor.growth)}%
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

