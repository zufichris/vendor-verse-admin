import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { VendorsList } from "@/components/vendors/vendors-list"
import { VendorsHeader } from "@/components/vendors/vendor-header"

export default function VendorsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 w-full pt-0">
        <DashboardHeader />
        <VendorsHeader />
        <VendorsList />
      </div>
    </DashboardShell>
  )
}

