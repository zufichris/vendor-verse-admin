import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  OverviewSkeleton,
  RecentOrdersSkeleton,
  TopProductsSkeleton,
  VendorMetricsSkeleton,
} from "@/components/skeletons"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 w-full pt-0">
        <DashboardHeader />
        <div className="grid gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 w-full">
          <OverviewSkeleton />
        </div>
        <div className="w-full">
          <TopProductsSkeleton />
          <VendorMetricsSkeleton />
        </div>
        <RecentOrdersSkeleton />
      </div>
    </DashboardShell>
  )
}

