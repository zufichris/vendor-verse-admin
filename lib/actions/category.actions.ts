"use server";

import { revalidatePath } from "next/cache";
import type { ProductCategory } from "@/types/product.types";
import type {
    CreateProductCategoryDto,
    UpdateProductCategoryDto,
} from "@/types/product.dto";
import type {
    PaginationResult,
    PaginationParams,
} from "@/types/pagination.types";
import { Api } from "@/utils/api";

export async function getCategories(params: PaginationParams = {}) {
    const query = new URLSearchParams(
        params as unknown as Record<string, string>,
    ).toString();
    const result = await Api.get<PaginationResult<ProductCategory>>(
        `/products/categories?${query}`,
    );
    return result;
}

export async function getCategory(slug: string) {
    const result = await Api.get<ProductCategory>(`/products/categories/${slug}`);
    return result;
}
export async function deleteCategory(id: string) {
    const result = await Api.delete(`/products/admin/categories/${id}`);
    revalidatePath("/categories")
    return result;
}

export async function createCategory(
    data: CreateProductCategoryDto,
) {
    const result = await Api.post<ProductCategory>(
        `/products/admin/categories`,
        data,
    );
    revalidatePath("/categories");
    return result;
}

export async function updateCategory(
    id: string,
    data: UpdateProductCategoryDto,
) {
    const result = await Api.patch<ProductCategory>(
        `/products/admin/categories/${id}`,
        data,
    );
    revalidatePath("/admin/categories");
    return result;
}
