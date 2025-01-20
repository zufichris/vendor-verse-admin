import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { OrdersList } from "@/components/orders/orders-list"
import { OrdersHeader } from "@/components/orders/order-header"


export default function OrdersPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 w-full pt-0">
        <DashboardHeader />
        <OrdersHeader />
        <OrdersList />
      </div>
    </DashboardShell>
  )
}

