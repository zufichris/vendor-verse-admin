"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "@/components/search"
import { Skeleton } from "@/components/ui/skeleton"
import { AddCustomerModal } from "./add-customer-modal"

export function CustomersHeader() {
  const [isLoading, setIsLoading] = useState(false)


  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-full sm:w-[300px]" />
          <Skeleton className="h-10 w-full sm:w-[120px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">Manage your customer base</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar />
        <AddCustomerModal />
      </div>
    </div>
  )
}

