import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Overview } from "@/components/overview"
import { RecentOrders } from "@/components/recent-orders"
import { TopProducts } from "@/components/top-products"
import { VendorMetrics } from "@/components/vendor-metrics"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 w-full pt-0">
        <DashboardHeader />
        <div className="grid gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 w-full">
          <Overview />
        </div>
        <div className="w-full space-y-6">
          <TopProducts />
          <VendorMetrics />
        </div>
        <RecentOrders />
      </div>
    </DashboardShell>
  )
}

