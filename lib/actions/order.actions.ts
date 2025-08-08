"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Order, OrderAnalytics, OrderFilters, FulfillmentStatus } from "@/types/order.types"
import { type CreateOrderDto, type UpdateOrderDto, CreateOrderDtoSchema, UpdateOrderDtoSchema } from "@/types/order.dto"
import type { PaginationResult } from "@/types/pagination.types"

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    userId: "user-1",
    items: [
      {
        productId: "prod-1",
        variantId: "var-1",
        name: "Premium T-Shirt",
        sku: "TSH-001-M-BLK",
        price: 29.99,
        quantity: 2,
        discount: 0,
        total: 59.98,
      },
    ],
    subTotal: 59.98,
    tax: 4.8,
    shipping: 9.99,
    discount: 0,
    grandTotal: 74.77,
    currency: "USD",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
    },
    payment: {
      method: "stripe",
      status: "paid",
      transactionId: "txn_123456789",
      paidAt: "2024-01-15T10:30:00Z",
    },
    fulfillmentStatus: "processing",
    notes: "Please handle with care",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    userId: "user-2",
    items: [
      {
        productId: "prod-2",
        name: "Wireless Headphones",
        sku: "WH-001-BLK",
        price: 199.99,
        quantity: 1,
        discount: 20.0,
        total: 179.99,
      },
    ],
    subTotal: 179.99,
    tax: 14.4,
    shipping: 0,
    discount: 20.0,
    grandTotal: 174.39,
    currency: "USD",
    shippingAddress: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "+1987654321",
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90210",
      country: "US",
    },
    payment: {
      method: "paypal",
      status: "paid",
      transactionId: "pp_987654321",
      paidAt: "2024-01-14T15:45:00Z",
    },
    fulfillmentStatus: "shipped",
    createdAt: "2024-01-14T15:00:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
  },
]

export async function getOrders(page = 1, limit = 10, filters: OrderFilters = {}): Promise<PaginationResult<Order>> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let filteredOrders = [...mockOrders]

  // Apply filters
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.shippingAddress.firstName.toLowerCase().includes(searchLower) ||
        order.shippingAddress.lastName.toLowerCase().includes(searchLower) ||
        order.shippingAddress.email.toLowerCase().includes(searchLower),
    )
  }

  if (filters.fulfillmentStatus) {
    filteredOrders = filteredOrders.filter((order) => order.fulfillmentStatus === filters.fulfillmentStatus)
  }

  if (filters.paymentStatus) {
    filteredOrders = filteredOrders.filter((order) => order.payment.status === filters.paymentStatus)
  }

  if (filters.paymentMethod) {
    filteredOrders = filteredOrders.filter((order) => order.payment.method === filters.paymentMethod)
  }

  if (filters.minAmount) {
    filteredOrders = filteredOrders.filter((order) => order.grandTotal >= filters.minAmount!)
  }

  if (filters.maxAmount) {
    filteredOrders = filteredOrders.filter((order) => order.grandTotal <= filters.maxAmount!)
  }

  const total = filteredOrders.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const orders = filteredOrders.slice(offset, offset + limit)

  return {
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockOrders.find((order) => order.id === id) || null
}

export async function getOrderAnalytics(): Promise<OrderAnalytics> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const totalOrders = mockOrders.length
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.grandTotal, 0)
  const averageOrderValue = totalRevenue / totalOrders

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    ordersToday: 5,
    ordersThisWeek: 23,
    ordersThisMonth: 89,
    pendingOrders: mockOrders.filter((o) => o.fulfillmentStatus === "pending").length,
    processingOrders: mockOrders.filter((o) => o.fulfillmentStatus === "processing").length,
    shippedOrders: mockOrders.filter((o) => o.fulfillmentStatus === "shipped").length,
    deliveredOrders: mockOrders.filter((o) => o.fulfillmentStatus === "delivered").length,
    cancelledOrders: mockOrders.filter((o) => o.fulfillmentStatus === "cancelled").length,
    returnedOrders: mockOrders.filter((o) => o.fulfillmentStatus === "returned").length,
  }
}

export async function createOrder(data: CreateOrderDto) {
  const validatedData = CreateOrderDtoSchema.parse(data)

  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Calculate totals
  const subTotal = validatedData.items.reduce((sum, item) => sum + item.total, 0)
  const grandTotal = subTotal + validatedData.tax + validatedData.shipping

  const newOrder: Order = {
    id: `order-${Date.now()}`,
    orderNumber: `ORD-${new Date().getFullYear()}-${String(mockOrders.length + 1).padStart(3, "0")}`,
    userId: "current-user", // This would come from session
    items: validatedData.items,
    subTotal,
    tax: validatedData.tax,
    shipping: validatedData.shipping,
    discount: 0,
    grandTotal,
    currency: "USD",
    shippingAddress: validatedData.shippingAddress,
    billingAddress: validatedData.billingAddress,
    payment: {
      method: "stripe",
      status: "pending",
    },
    fulfillmentStatus: "pending",
    notes: validatedData.notes,
    createdAt: new Date().toISOString(),
  }

  mockOrders.push(newOrder)
  revalidatePath("/admin/orders")
  redirect("/admin/orders")
}

export async function updateOrder(id: string, data: UpdateOrderDto) {
  const validatedData = UpdateOrderDtoSchema.parse(data)

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const orderIndex = mockOrders.findIndex((order) => order.id === id)
  if (orderIndex === -1) {
    throw new Error("Order not found")
  }

  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    ...validatedData,
    updatedAt: new Date().toISOString(),
  }

  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${id}`)
}

export async function updateOrderStatus(id: string, status: FulfillmentStatus) {
  await updateOrder(id, { fulfillmentStatus: status })
}

export async function deleteOrder(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const orderIndex = mockOrders.findIndex((order) => order.id === id)
  if (orderIndex === -1) {
    throw new Error("Order not found")
  }

  mockOrders.splice(orderIndex, 1)
  revalidatePath("/admin/orders")
}

export async function refundOrder(id: string, amount?: number) {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const orderIndex = mockOrders.findIndex((order) => order.id === id)
  if (orderIndex === -1) {
    throw new Error("Order not found")
  }

  const order = mockOrders[orderIndex]
  const refundAmount = amount || order.grandTotal

  mockOrders[orderIndex] = {
    ...order,
    payment: {
      ...order.payment,
      status: refundAmount === order.grandTotal ? "refunded" : "partially-refunded",
      refundAmount,
      refundedAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  }

  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${id}`)
}
