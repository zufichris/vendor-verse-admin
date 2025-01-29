"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import  React,{ useCallback } from "react"
import { Card, CardContent } from "../ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { AddCustomerModal } from "./add-customer-modal"
import { Users, UserCheck, UserX } from "lucide-react"

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
}

const StatsCard = ({ title, value, description, icon, trend }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
              {trend && (
                <span className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                  {trend.isPositive ? "+" : "-"}
                  {trend.value}%
                </span>
              )}
            </div>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {trend && <p className="text-xs text-muted-foreground mt-1">{trend.label}</p>}
          </div>
          <div className="rounded-full bg-primary/10 p-2 sm:p-3 text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CustomersHeaderProps {
  readonly page: number
  readonly limit: number
  readonly totalPages: number
  readonly filterCount: number
  readonly totalCount: number
  readonly hasNextPage: boolean
  readonly hasPreviousPage: boolean
  readonly firstItemIndex: number
  readonly lastItemIndex: number
  readonly suspendedCount: number
  readonly activeCount: number
  readonly sortField?: string
  readonly sortOrder?: "asc" | "desc"
  readonly nextPage?: number
  readonly previousPage?: number
}

export const CustomersHeader = ({
  filterCount = 0,
  totalCount = 0,
  totalPages = 0,
  activeCount = 0,
  suspendedCount = 0,
  hasNextPage,
  hasPreviousPage,
  limit,
  page,
  nextPage,
  previousPage,
}: CustomersHeaderProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const startRange = (page - 1) * limit + 1
  const endRange = Math.min(page * limit, filterCount)

  const queryString = useCallback(
    (qObj: Record<string, any>) => {
      const search = new URLSearchParams(searchParams.toString())
      Object.keys(qObj).forEach((key) => {
        if (!qObj[key]) {
          search.delete(key)
          delete qObj[key]
        } else {
          search.set(key, qObj[key])
        }
      })
      return search.toString()
    },
    [searchParams],
  )

  const handlePageChange = (page?: number) => {
    if (!page) return
    const search = queryString({ page: page })
    router.push(`?${search}`)
  }

  const handleLimitChange = (limit: string) => {
    const search = queryString({ limit: Number(limit), page: undefined })
    router.push(`?${search}`)
  }

  const handleShowInActive = (checked: boolean) => {
    const search = queryString({ show_inactive: checked })
    router.push(`?${search}`)
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-center sm:justify-end">
        <AddCustomerModal />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Customers"
          value={totalCount}
          icon={<Users className="h-5 w-5" />}
          trend={{
            value: 12,
            label: "Compared to last month",
            isPositive: true,
          }}
        />
        <StatsCard
          title="Active Customers"
          value={activeCount}
          icon={<UserCheck className="h-5 w-5" />}
          trend={{
            value: 8,
            label: "Active rate this month",
            isPositive: true,
          }}
        />
        <StatsCard
          title="Suspended Customers"
          value={suspendedCount}
          icon={<UserX className="h-5 w-5" />}
          trend={{
            value: 2,
            label: "Suspension rate this month",
            isPositive: false,
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
            <span className="font-medium">Show Suspended</span>
            <Switch checked={searchParams.get("show_inactive") === "true"} onCheckedChange={handleShowInActive} />
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Select limit" />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((limit) => (
                <SelectItem key={limit} value={limit.toString()}>
                  {limit} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Showing <span className="font-medium">{startRange}</span> to <span className="font-medium">{endRange}</span>{" "}
            of <span className="font-medium">{filterCount}</span> results
          </p>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(previousPage)}
            disabled={!hasPreviousPage}
            className="h-8 w-8"
          >
            ←
          </Button>

          {page > 2 && (
            <>
              <Button variant="ghost" size="icon" onClick={() => handlePageChange(1)} className="h-8 w-8">
                1
              </Button>
              {page > 3 && <span className="px-1">...</span>}
            </>
          )}

          {page > 1 && (
            <Button variant="ghost" size="icon" onClick={() => handlePageChange(page - 1)} className="h-8 w-8">
              {page - 1}
            </Button>
          )}

          <Button variant="default" size="icon" className="h-8 w-8">
            {page}
          </Button>

          {page < totalPages && (
            <Button variant="ghost" size="icon" onClick={() => handlePageChange(page + 1)} className="h-8 w-8">
              {page + 1}
            </Button>
          )}

          {page < totalPages - 1 && (
            <>
              {page < totalPages - 2 && <span className="px-1">...</span>}
              <Button variant="ghost" size="icon" onClick={() => handlePageChange(totalPages)} className="h-8 w-8">
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(nextPage)}
            disabled={!hasNextPage}
            className="h-8 w-8"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  )
}

