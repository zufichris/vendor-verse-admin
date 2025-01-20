import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { CustomersList } from "@/components/customers/customers-list"
import { CustomersHeader } from "@/components/customers/customers-header"

export default function CustomersPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 w-full pt-0">
        <DashboardHeader />
        <CustomersHeader />
        <CustomersList />
      </div>
    </DashboardShell>
  )
}

