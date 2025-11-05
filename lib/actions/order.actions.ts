"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Order, OrderAnalytics, OrderFilters, FulfillmentStatus } from "@/types/order.types"
import { type CreateOrderDto, type UpdateOrderDto, CreateOrderDtoSchema, UpdateOrderDtoSchema } from "@/types/order.dto"
import type { PaginationResult } from "@/types/pagination.types"
import { Api } from "@/utils/api"

export async function getOrders(page = 1, limit = 10, filters: OrderFilters = {}): Promise<PaginationResult<Order>> {

  const searchParams = new URLSearchParams({
    page: page.toString(), limit: limit.toString()
  })

  Object.entries(filters).map(([k, v]) => {
    if (v && v?.toString()?.trim()) {
      searchParams.append(k, v)
    }
  })

  const { data } = await Api.get<PaginationResult<Order>>(`/orders/admin?${searchParams.toString()}`);

  return data!;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const result = await Api.get<Order>(`/orders/admin/${id}`)

  return result.data;
}

export async function getOrderAnalytics(): Promise<OrderAnalytics> {

  const result = await Api.get<OrderAnalytics>('/orders/admin/analytics')

  if (!result.success) {
    return {
      averageOrder: {
        pastThreeMonths: 0,
        thisMonth: 0
      },
      pendingOrders: {
        processing: 0,
        total: 0
      },
      totalOrders: {
        today: 0,
        total: 0
      },
      totalRevenue: {
        thisWeek: 0,
        total: 0
      }
    }
  }

  return result.data;
}

export async function createOrder(data: CreateOrderDto) {
  const validatedData = CreateOrderDtoSchema.parse(data)

  const result = await Api.post<{ paymentLink: string }>('/orders/admin', validatedData)

  if (!result.success) {
    return
  }
  revalidatePath("/orders")
  // redirect("/orders") // We don't want to redirect because we need to show a popup with option to copy payment link url
  return result
}

export async function updateOrder(id: string, data: UpdateOrderDto) {
  const validatedData = UpdateOrderDtoSchema.parse(data)

  const result = await Api.put(`/orders/admin/${id}`, validatedData)

  if (!result.success) {
    return
  }

  revalidatePath("/orders")
  revalidatePath(`/orders/${id}`)
}

export async function updateOrderStatus(id: string, status: FulfillmentStatus) {
  await updateOrder(id, { fulfillmentStatus: status })
}

export async function deleteOrder(id: string) {
  const res = await Api.delete(`/orders/admin/${id}`)

  revalidatePath("/orders")
  revalidatePath(`/orders${id}`)
  redirect('/orders')
}

export async function refundOrder(id: string, amount?: number) {

  await Api.post<boolean>(`/orders/admin/${id}/refund`, {})

  revalidatePath("/orders")
  revalidatePath(`/orders/${id}`)
}
