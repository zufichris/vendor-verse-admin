"use server"

import { revalidatePath } from "next/cache"
import type { Banner } from "@/types/product.types"
import type { PaginationResult, PaginationParams } from "@/types/pagination.types"
import { Api } from "@/utils/api"
import { BannersAnalytics, UserAnalytics } from "@/types/user.dto"
import { BannerFormValues } from "../validations/banner.validations"

export async function getBanners(params: PaginationParams = {}): Promise<PaginationResult<Banner>> {
  const searchParams = new URLSearchParams()
  const { page = 1, limit = 10, search = "" } = params

  Object.entries({ page, limit, search }).map(([k, v]) => {
    if (v.toString().trim()) {
      searchParams.set(k, v.toString().trim())
    }
  })

  const res = await Api.get(`/products/banners?${searchParams.toString()}`);

  return (res.data || {
    data: [],
    totalCount: 0,
    filterCount: 0,
    page: params.page || 1,
    limit: params.limit || 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  }) as unknown as PaginationResult<Banner>
}

export const getBannersAnalytics = async () => {
  const res = await Api.get<BannersAnalytics>('/products/banners/analytics')

  return res.data
}

export async function getBanner(id: string): Promise<Banner | null> {
  const res = await Api.get<Banner>(`/products/banners/${id}`)

  return res.data;
}

export async function createBanner(
  data: BannerFormValues
): Promise<{ success: boolean; error?: string; bannerId?: string }> {
  try {
    const res = await Api.post<Banner>('/products/admin/banners', data)

    if (!res.success) {
      throw res
    }

    const newBannerId = `banner_${Date.now()}`
    revalidatePath("/banners")

    return { success: true, bannerId: newBannerId }
  } catch (error) {
    console.error("Error creating banner:", error)
    return { success: false, error: "Failed to create banner" }
  }
}

export async function updateBanner(id: string, data: BannerFormValues): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await Api.patch<Banner>(`/products/admin/banners/${id}`, data)

    if (!res.success) {
      throw res
    }

    revalidatePath("/banners")
    revalidatePath(`/banners/${id}`)

    return { success: true }
  } catch (error) {
    console.error("Error updating banner:", error)
    return { success: false, error: "Failed to update banner" }
  }
}

export async function deleteBanner(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("Deleting banner:", id)

    revalidatePath("/admin/banners")

    return { success: true }
  } catch (error) {
    console.error("Error deleting banner:", error)
    return { success: false, error: "Failed to delete banner" }
  }
}
