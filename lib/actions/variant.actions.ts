"use server";

import { revalidatePath } from "next/cache";
import type { ProductVariant } from "@/types/product.types";
import type { PaginationParams } from "@/types/pagination.types";
import { Api } from "@/utils/api";
import {
  CreateVariantDto,
  UpdateVariantDto,
} from "../validations/product.validations";

export async function getProductVariants(
  productId: string,
  params: PaginationParams = {},
) {
  const result = await Api.get<ProductVariant>(
    `/products/${productId}/variants`,
  );

  return result;
}

export async function getVariant(variantId: string) {
  const result = await Api.get<ProductVariant>(
    `/products/variants/${variantId}`,
  );
  return result;
}

export async function createVariant(data: CreateVariantDto) {
  const result = await Api.post<ProductVariant>(
    `/products/${data.productId}/variants`,
    data,
  );
  revalidatePath(`/admin/products/${data.productId}/variants`);
  revalidatePath(`/admin/products/${data.productId}`);
  return result;
}

export async function updateVariant(variantId: string, data: UpdateVariantDto) {
  const result = await Api.put<ProductVariant>(
    `/products/variants/${variantId}`,
    data,
  );
  return result;
}

export async function deleteVariant(variantId: string) {
  const result = await Api.delete(`/products/variants/${variantId}`);
}

export async function toggleVariantStock(
  variantId: string,
  isInStock: boolean,
) {
  const result = await Api.patch(`/products/variants/${variantId}/stock`, {
    isInStock,
  });
  return result;
}

export async function duplicateVariant(
  variantId: string,
): Promise<{ success: boolean; error?: string; variantId?: string }> {
  return { success: true, variantId: variantId };
}
