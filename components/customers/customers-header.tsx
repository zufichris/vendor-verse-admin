"use client"
import { Switch } from "@/components/ui/switch"
import { AddCustomerModal } from "./add-customer-modal"
import { Users, UserCheck, UserX } from "lucide-react"
import { useQueryString } from "@/hooks/use-query-string"
import React from "react"
import { CustomTableHeader } from "../custom-table/header"
import { TableStatsCard } from "../custom-table/status-card"
interface CustomersHeaderProps {
  readonly page: number
  readonly limit: number
  readonly totalPages: number
  readonly filterCount: number
  readonly totalCount: number
  readonly hasNextPage: boolean
  readonly hasPreviousPage: boolean
  readonly suspendedCount: number
  readonly activeCount: number
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
  const { queryString, searchParams } = useQueryString()

  const handleShowInActive = (checked: boolean) => {
    queryString({ show_inactive: checked })
  }

  return (
    <CustomTableHeader
      pagination={{
        filterCount,
        hasNextPage,
        hasPreviousPage,
        limit,
        page,
        totalPages,
        nextPage,
        previousPage,
      }}
      ActionButtons={<AddCustomerModal />}
      StatusCards={<React.Fragment>
        <TableStatsCard
          title="Total Customers"
          value={totalCount}
          icon={<Users className="h-5 w-5" />}
          trend={{
            value: 12,
            label: "Compared to last month",
            isPositive: true,
          }}
        />
        <TableStatsCard
          title="Active Customers"
          value={activeCount}
          icon={<UserCheck className="h-5 w-5" />}
          trend={{
            value: 8,
            label: "Active rate this month",
            isPositive: true,
          }}
        />
        <TableStatsCard
          title="Suspended Customers"
          value={suspendedCount}
          icon={<UserX className="h-5 w-5" />}
          trend={{
            value: 2,
            label: "Suspension rate this month",
            isPositive: false,
          }}
        />
      </React.Fragment>}
      Filters={<div className="flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
        <span className="font-medium">Show Suspended</span>
        <Switch checked={searchParams.get("show_inactive") === "true"} onCheckedChange={handleShowInActive} />
      </div>}
    />
  )
}

