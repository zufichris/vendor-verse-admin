import { Label } from "@/components/ui/label"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit, DollarSign, MapPin, CreditCard, Package, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { getOrderById } from "@/lib/actions/order.actions"
import { OrderDetailsActions } from "@/components/orders/order-details-actions"

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const fulfillmentStatusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    returned: "bg-orange-100 text-orange-800",
  }

  const paymentStatusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
    "partially-refunded": "bg-orange-100 text-orange-800",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order {order.orderNumber}</h1>
          <p className="text-muted-foreground">Created on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/orders/${order.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </Link>
          </Button>
          <OrderDetailsActions order={order} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.total)}</p>
                      {item.discount > 0 && (
                        <p className="text-sm text-green-600">-{formatCurrency(item.discount)} discount</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.email}</p>
                <p>{order.shippingAddress.phone}</p>
                <div className="text-muted-foreground">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Order Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Fulfillment Status</Label>
                <div className="mt-1">
                  <Badge variant="secondary" className={fulfillmentStatusColors[order.fulfillmentStatus]}>
                    {order.fulfillmentStatus}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Payment Status</Label>
                <div className="mt-1">
                  <Badge variant="secondary" className={paymentStatusColors[order.payment.status]}>
                    {order.payment.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Method:</span>
                <span className="text-sm font-medium capitalize">{order.payment.method.replace("-", " ")}</span>
              </div>

              {order.payment.transactionId && (
                <div className="flex justify-between">
                  <span className="text-sm">Transaction ID:</span>
                  <span className="text-sm font-mono">{order.payment.transactionId}</span>
                </div>
              )}

              {order.payment.paidAt && (
                <div className="flex justify-between">
                  <span className="text-sm">Paid At:</span>
                  <span className="text-sm">{formatDate(order.payment.paidAt)}</span>
                </div>
              )}

              {order.payment.refundAmount && (
                <div className="flex justify-between">
                  <span className="text-sm">Refunded:</span>
                  <span className="text-sm font-medium text-red-600">
                    -{formatCurrency(order.payment.refundAmount)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal:</span>
                <span className="text-sm">{formatCurrency(order.subTotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Tax:</span>
                <span className="text-sm">{formatCurrency(order.tax)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Shipping:</span>
                <span className="text-sm">{formatCurrency(order.shipping)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Discount:</span>
                  <span className="text-sm text-green-600">-{formatCurrency(order.discount)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>
                  {formatCurrency(order.grandTotal)} {order.currency}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Order Created</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              {order.payment.paidAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment Received</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.payment.paidAt)}</p>
                  </div>
                </div>
              )}

              {order.updatedAt && order.updatedAt !== order.createdAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
