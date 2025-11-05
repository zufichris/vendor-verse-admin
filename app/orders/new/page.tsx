import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateOrderForm } from "@/components/orders/create-order-form"
import { getProducts } from "@/lib/actions/product.actions"

export default async function NewOrderPage() {
  const products = await getProducts()

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
          <CreateOrderForm defaultProducts={products.data?.data || []} />
        </CardContent>
      </Card>
    </div>
  )
}
