import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProductsList } from "@/components/products/products-list"
import { ProductsHeader } from "@/components/products/products-header"

export default function ProductsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 w-full pt-0">
        <DashboardHeader />
        <ProductsHeader />
        <ProductsList />
      </div>
    </DashboardShell>
  )
}

