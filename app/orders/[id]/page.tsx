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
import OrderDetails from "@/components/orders/order-details"

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  return <OrderDetails order={order} />
}
