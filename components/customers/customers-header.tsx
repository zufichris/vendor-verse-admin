'use client'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCallback,} from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { AddCustomerModal } from "./add-customer-modal"

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

interface StatsCardProps {
  title: string
  value: number | string
  description?: string
}

const StatsCard = ({ title, value, description }: StatsCardProps) => {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </CardContent>
    </Card>
  )
}
interface CustomersHeaderProps {
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly filterCount: number;
  readonly totalCount: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
  readonly firstItemIndex: number;
  readonly lastItemIndex: number;
  readonly suspendedCount: number;
  readonly activeCount: number;
  readonly sortField?: string;
  readonly sortOrder?: "asc" | "desc";
  readonly nextPage?: number;
  readonly previousPage?: number;
}


export const CustomersHeader = ({ filterCount = 0, totalCount = 0, totalPages = 0, activeCount = 0, suspendedCount = 0, hasNextPage, hasPreviousPage, limit, page, nextPage, previousPage, firstItemIndex, lastItemIndex, sortField, sortOrder }: CustomersHeaderProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const startRange = (page - 1) * limit + 1
  const endRange = Math.min(page * limit, filterCount)
  const queryString = useCallback(function (qObj: Record<string, any>) {
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
  }, [searchParams])

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
    const search = queryString({ 'show_inactive': checked })
    router.push(`?${search}`)
  }

  return (
    <div className="p-4">
      <div className="w-full flex justify-end mb-2"><AddCustomerModal /></div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <StatsCard title="Total Users" value={totalCount} />
        <StatsCard title="Active Users" value={activeCount} />
        <StatsCard title="Suspended Users" value={suspendedCount} />
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Showing {startRange} to {endRange} of {filterCount} results
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Show Suspended</span>
                <Switch checked={(searchParams.get('show_inactive') === 'true')} onCheckedChange={handleShowInActive} />
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4">
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-[120px]">
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

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handlePageChange(previousPage)} disabled={!hasPreviousPage}>
                  ←
                </Button>
                <div className="hidden sm:flex items-center gap-1 text-sm">
                  <span>Page {page}</span>
                  <span className="text-muted-foreground">of {totalPages}</span>
                </div>
                <div className="sm:hidden text-sm">
                  {page}/{totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(nextPage)}
                  disabled={!hasNextPage}
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


