import OrderDetailsModal from '@/components/orders/order-details-modal'
import { getOrderById } from '@/lib/actions/order.actions'
import { notFound } from 'next/navigation'
import React from 'react'

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetails({params}: OrderDetailsPageProps) {
  const { id } = await params
    const order = await getOrderById(id)
  
    if (!order) {
      notFound()
    }
  
  return (
    <OrderDetailsModal order={order} />
  )
}
