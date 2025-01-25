import { VendorsTableSkeleton } from "@/components/vendors/vendors-skeleton"

export default function VendorsLoading() {
  return (
    <div className="flex flex-col gap-6 w-full pt-0">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Vendors</h2>
        <p className="text-muted-foreground">Manage your vendor partnerships</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-[300px] h-10 bg-muted/10 animate-pulse rounded-md" />
        <div className="w-full sm:w-[120px] h-10 bg-muted/10 animate-pulse rounded-md" />
      </div>
    </div>
    <VendorsTableSkeleton />
  </div>
  )
}

