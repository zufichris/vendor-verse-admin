import { OrdersList } from "@/components/orders/orders-list"
import { OrdersHeader } from "@/components/orders/order-header"


export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6 w-full pt-0">
      <OrdersHeader />
      <OrdersList />
    </div>
  )
}

