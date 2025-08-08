import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateOrderForm } from "@/components/orders/create-order-form"

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Order</h1>
        <p className="text-muted-foreground">Create a new order for a customer</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateOrderForm />
        </CardContent>
      </Card>
    </div>
  )
}
