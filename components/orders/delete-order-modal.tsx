"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, AlertTriangle } from "lucide-react"
import { deleteOrder, getOrderById } from "@/lib/actions/order.actions"
import { toast } from "sonner"
import { useEffect } from "react"
import type { Order } from "@/types/order.types"

interface DeleteOrderModalProps {
  orderId: string | null
  onClose: () => void
}

export function DeleteOrderModal({ orderId, onClose }: DeleteOrderModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then(setOrder)
    }
  }, [orderId])

  const handleDelete = async () => {
    if (!orderId) return

    setIsDeleting(true)
    try {
      await deleteOrder(orderId)
      toast.success("Order deleted successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to delete order")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={!!orderId} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Order
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>Are you sure you want to delete this order? This action cannot be undone.</p>

              {order && (
                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Order Number:</span>
                      <span>{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Customer:</span>
                      <span>
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-medium">
                        ${order.grandTotal.toFixed(2)} {order.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className="capitalize">{order.fulfillmentStatus}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> Deleting this order will permanently remove all order data, including
                  customer information, items, and payment details. This action cannot be undone.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Order"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
