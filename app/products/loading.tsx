import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProductsTableSkeleton } from "@/components/products/products-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <div className="flex flex-col gap-6 w-full">
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
      <ProductsTableSkeleton />
    </div>
  )
}

