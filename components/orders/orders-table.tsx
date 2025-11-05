"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Eye, Edit, Truck, RefreshCw, DollarSign, X } from "lucide-react"
import Link from "next/link"
import type { Order, OrderFilters, FulfillmentStatus } from "@/types/order.types"
import type { PaginationResult } from "@/types/pagination.types"
import { updateOrderStatus, refundOrder } from "@/lib/actions/order.actions"
import { DeleteOrderModal } from "./delete-order-modal"
import { toast } from "sonner"
import { SimplePagination } from "../ui/simple-pagination"
import { cn } from "@/lib/utils"

interface OrdersTableProps {
  pagination: PaginationResult<Order>
  filters: OrderFilters
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

export function OrdersTable({ pagination, filters }: OrdersTableProps) {
  const orders = pagination?.data || [];
  const router = useRouter()
  const searchParams = useSearchParams()
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value?.trim() && value.trim() !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page") // Reset to first page when filtering
    router.push(`/orders?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/orders")
  }

  const handleStatusUpdate = async (orderId: string, status: FulfillmentStatus) => {
    setIsUpdating(orderId)
    try {
      await updateOrderStatus(orderId, status)
      toast.success("Order status updated successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update order status")
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRefund = async (orderId: string) => {
    setIsUpdating(orderId)
    try {
      await refundOrder(orderId)
      toast.success("Order refunded successfully")
    } catch (error) {
      toast.error("Failed to refund order")
    } finally {
      setIsUpdating(null)
    }
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== "")

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={filters.search || ""}
              onChange={(e) => updateSearchParams("search", e.target.value || null)}
              className="pl-8 w-[300px]"
            />
          </div>

          <Select
            value={filters.status || "all"}
            onValueChange={(value) => updateSearchParams("status", value || null)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.paymentStatus || "all"}
            onValueChange={(value) => updateSearchParams("paymentStatus", value || null)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="partially-refunded">Partially Refunded</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} size="sm">
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.orderNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">{order.shippingAddress.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="text-sm">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-muted-foreground">+{order.items.length - 2} more</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatCurrency(order.grandTotal, order.currency)}</div>
                    <div className="text-sm text-muted-foreground">{order.payment.method}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(paymentStatusColors[order.payment.status], 'uppercase')}>
                      {order.payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(fulfillmentStatusColors[order.fulfillmentStatus], 'uppercase')}>
                      {order.fulfillmentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(order.createdAt)}</div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating === order.id}>
                          <span className="sr-only">Open menu</span>
                          {isUpdating === order.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/orders/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem asChild>
                          <Link href={`/orders/${order.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Order
                          </Link>
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />

                        {order.fulfillmentStatus === "pending" && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "processing")}>
                            <Truck className="mr-2 h-4 w-4" />
                            Mark Processing
                          </DropdownMenuItem>
                        )}

                        {order.fulfillmentStatus === "processing" && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "shipped")}>
                            <Truck className="mr-2 h-4 w-4" />
                            Mark Shipped
                          </DropdownMenuItem>
                        )}

                        {order.fulfillmentStatus === "shipped" && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, "delivered")}>
                            <Truck className="mr-2 h-4 w-4" />
                            Mark Delivered
                          </DropdownMenuItem>
                        )}

                        {order.payment.status === "paid" && order.fulfillmentStatus !== 'delivered' && (
                          <DropdownMenuItem onClick={() => handleRefund(order.id)}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Refund Order
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteOrderId(order.id)} className="text-red-600">
                          Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <SimplePagination
          {...pagination}
          currentPage={pagination.page}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("page", page.toString())
            router.push(`/orders?${params.toString()}`)
          }}
        />
      )}

      {/* Delete Modal */}
      <DeleteOrderModal orderId={deleteOrderId} onClose={() => setDeleteOrderId(null)} />
    </div>
  )
}
