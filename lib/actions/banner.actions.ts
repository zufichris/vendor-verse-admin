"use server"

import { revalidatePath } from "next/cache"
import type { Banner } from "@/types/product.types"
import type { PaginationResult, PaginationParams } from "@/types/pagination.types"

// Mock data
const mockBanners: Banner[] = [
  {
    id: "1",
    slug: "summer-sale-2024",
    title: "Summer Sale 2024",
    subtitle: "Up to 70% Off",
    description: "Don't miss our biggest summer sale with incredible discounts on all categories",
    image: "/placeholder.svg?height=400&width=800&text=Summer+Sale",
    cta: "Shop Now",
    link: "/categories/summer-sale",
    color: "#ff6b6b",
  },
  {
    id: "2",
    slug: "new-arrivals",
    title: "New Arrivals",
    subtitle: "Fresh Collection",
    description: "Discover our latest products and trending items",
    image: "/placeholder.svg?height=400&width=800&text=New+Arrivals",
    cta: "Explore",
    link: "/categories/new-arrivals",
    color: "#4ecdc4",
  },
]

export async function getBanners(params: PaginationParams = {}): Promise<PaginationResult<Banner>> {
  const { page = 1, limit = 10, search = "" } = params

  await new Promise((resolve) => setTimeout(resolve, 800))

  let filteredBanners = [...mockBanners]

  if (search) {
    filteredBanners = filteredBanners.filter(
      (banner) =>
        banner.title.toLowerCase().includes(search.toLowerCase()) ||
        banner.subtitle.toLowerCase().includes(search.toLowerCase()),
    )
  }

  const totalCount = mockBanners.length
  const filterCount = filteredBanners.length
  const startIndex = (page - 1) * limit
  const paginatedData = filteredBanners.slice(startIndex, startIndex + limit)
  const totalPages = Math.ceil(filterCount / limit)

  return {
    data: paginatedData,
    totalCount,
    filterCount,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}

export async function getBanner(id: string): Promise<Banner | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBanners.find((banner) => banner.id === id) || null
}

export async function createBanner(
  data: Omit<Banner, "id">,
): Promise<{ success: boolean; error?: string; bannerId?: string }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Creating banner:", data)

    const newBannerId = `banner_${Date.now()}`
    revalidatePath("/admin/banners")

    return { success: true, bannerId: newBannerId }
  } catch (error) {
    console.error("Error creating banner:", error)
    return { success: false, error: "Failed to create banner" }
  }
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<{ success: boolean; error?: string }> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Updating banner:", id, data)

    revalidatePath("/admin/banners")
    revalidatePath(`/admin/banners/${id}`)

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
