import { CustomersList } from "@/components/customers/customers-list"
import { CustomersHeader } from "@/components/customers/customers-header"

export default async function CustomersPage() {
  return (
    <div className="flex flex-col gap-6 w-full pt-0">
      <CustomersHeader />
      <CustomersList />
    </div>
  )
}

