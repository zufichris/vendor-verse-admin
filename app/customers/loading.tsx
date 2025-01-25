import { CustomersTableSkeleton } from "@/components/customers/customers-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomersLoading() {
  return (
    <div className="flex flex-col gap-6 w-full pt-0">
      <div className="space-y-1">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 w-full sm:w-[300px]" />
        <Skeleton className="h-10 w-full sm:w-[120px]" />
      </div>
      <CustomersTableSkeleton />
    </div>
  )
}

