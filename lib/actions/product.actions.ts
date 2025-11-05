"use server";

import { revalidatePath } from "next/cache";
import type { CreateProductDto, UpdateProductDto } from "@/types/product.dto";
import type { Product, ProductCategory } from "@/types/product.types";
import type {
    PaginationResult,
    PaginationParams,
} from "@/types/pagination.types";
import { Api } from "@/utils/api";
import { error } from "console";
1234
export async function getProducts(params: PaginationParams = {}) {
    const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
        filters = {},
    } = params;
    const query = new URLSearchParams(
        params as Record<string, string>,
    ).toString();
    const result = await Api.get<PaginationResult<Product>>("/products?${query}");
    return result;
}

export async function getProduct(id: string) {
    const result = await Api.get<Product>(`/products/${id}`);
    return result;
}

export async function getProductBySlug(slug: string) {
    const result = await Api.get<Product>(`/products/slug/${slug}`);
    return result;
}

export async function getProductCategories() {
    const result = await Api.get<PaginationResult<ProductCategory>>(
        "/products/categories",
    );
    return result;
}

export async function createProduct(data: CreateProductDto) {
    const result = await Api.post<Product>("/products/admin", data);

    if (result.success) revalidatePath("/products");

    return result;
}

export async function updateProduct(id: string, data: UpdateProductDto) {
    const result = await Api.patch<Product>(`/products/admin/${id}`, data);
    if (result.success) {
        revalidatePath("/products");
        revalidatePath(`/products/${result.data.slug}`);
    }
    return result;
}

export async function deleteProduct(id: string) {
    const result = await Api.delete(`/products/admin/${id}`);
    if (result.success) revalidatePath("/products");
    return result;
}

export async function toggleProductStatus(
    id: string,
    status: "active" | "inactive",
): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);

    return { success: true };
}

export async function duplicateProduct(
    id: string,
): Promise<{ success: boolean; error?: string; productId?: string }> {
    revalidatePath("/admin/products");

    return { success: false, error: "Failed to duplicate product" };
}
