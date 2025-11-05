"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Truck, DollarSign, RefreshCw, Trash2 } from "lucide-react"
import type { Order, FulfillmentStatus } from "@/types/order.types"
import { updateOrderStatus, refundOrder } from "@/lib/actions/order.actions"
import { DeleteOrderModal } from "./delete-order-modal"
import { toast } from "sonner"

interface OrderDetailsActionsProps {
  order: Order
}

export function OrderDetailsActions({ order }: OrderDetailsActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleStatusUpdate = async (status: FulfillmentStatus) => {
    setIsUpdating(true)
    try {
      await updateOrderStatus(order.id, status)
      toast.success("Order status updated successfully")
    } catch (error) {
      toast.error("Failed to update order status")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRefund = async () => {
    setIsUpdating(true)
    try {
      await refundOrder(order.id)
      toast.success("Order refunded successfully")
    } catch (error) {
      toast.error("Failed to refund order")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isUpdating}>
            {isUpdating ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="mr-2 h-4 w-4" />
            )}
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {order.fulfillmentStatus === "pending" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("processing")}>
              <Truck className="mr-2 h-4 w-4" />
              Mark as Processing
            </DropdownMenuItem>
          )}

          {order.fulfillmentStatus === "processing" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("shipped")}>
              <Truck className="mr-2 h-4 w-4" />
              Mark as Shipped
            </DropdownMenuItem>
          )}

          {order.fulfillmentStatus === "shipped" && (
            <DropdownMenuItem onClick={() => handleStatusUpdate("delivered")}>
              <Truck className="mr-2 h-4 w-4" />
              Mark as Delivered
            </DropdownMenuItem>
          )}

          {order.payment.status === "paid" && order.fulfillmentStatus !== 'delivered' && (
            <DropdownMenuItem onClick={handleRefund}>
              <DollarSign className="mr-2 h-4 w-4" />
              Refund Order
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteModal(true)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteOrderModal orderId={showDeleteModal ? order.id : null} onClose={() => setShowDeleteModal(false)} />
    </>
  )
}
