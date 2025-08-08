import { z } from "zod";
import {
  DimensionsSchema,
  ImageSchema,
  type ProductCategorySchema,
  ProductConditionSchema,
  ProductSchema,
  ProductStatusSchema,
  ProductTypeSchema,
  ProductVisibilitySchema,
  SeoSchema,
} from "./product.types";

export const CreateProductDtoSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .describe("The product name as it will appear on the website"),
    description: z
      .string()
      .min(1)
      .describe("Detailed description of the product for customers"),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional()
      .describe(
        "URL-friendly version of the product name (auto-generated if not provided)",
      ),
    sku: z
      .string()
      .min(1)
      .max(50)
      .optional()
      .describe(
        "Stock Keeping Unit - unique identifier for inventory tracking",
      ),
    price: z
      .number()
      .positive()
      .describe("Base price of the product in the specified currency"),
    currency: z
      .string()
      .length(3)
      .describe("Three-letter currency code (e.g., USD, EUR)"),
    discountPercentage: z
      .number()
      .min(0)
      .max(100)
      .optional()
      .describe("Percentage discount to apply (0-100)"),
    discountFixedAmount: z
      .number()
      .positive()
      .optional()
      .describe("Fixed amount discount in the product currency"),
    discountStartDate: z
      .string()
      .datetime()
      .optional()
      .describe("When the discount becomes active"),
    discountEndDate: z
      .string()
      .datetime()
      .optional()
      .describe("When the discount expires"),
    categoryId: z
      .string()
      .describe("ID of the category this product belongs to"),
    brand: z.string().min(1).optional().describe("Brand or manufacturer name"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Keywords for better product discovery"),
    images: z
      .array(ImageSchema)
      .min(1)
      .describe("Product images (at least one required)"),
    thumbnail: ImageSchema.describe("Main product image used in listings"),
    type: ProductTypeSchema.describe(
      "Product type determines how variants are handled",
    ),
    status: ProductStatusSchema.describe("Current status of the product"),
    visibility: ProductVisibilitySchema.describe("Who can see this product"),
    condition: ProductConditionSchema.optional().describe(
      "Physical condition of the product",
    ),
    featured: z
      .boolean()
      .describe("Whether to highlight this product in featured sections"),
    stockQuantity: z
      .number()
      .int()
      .min(0)
      .describe("Available quantity in inventory"),
    variants: z
      .array(
        z.object({
          sku: z
            .string()
            .min(1)
            .max(50)
            .describe("Unique SKU for this variant"),
          name: z.string().optional().describe("Display name for this variant"),
          price: z
            .number()
            .positive()
            .describe("Price for this specific variant"),
          currency: z
            .string()
            .length(3)
            .describe("Currency code for variant pricing"),
          discountPrice: z
            .number()
            .positive()
            .optional()
            .describe("Discounted price for this variant"),
          discountPercentage: z
            .number()
            .min(0)
            .max(100)
            .optional()
            .describe("Percentage discount for variant"),
          discountFixedAmount: z
            .number()
            .positive()
            .optional()
            .describe("Fixed discount amount for variant"),
          attributes: z
            .record(z.string(), z.string())
            .optional()
            .describe("Variant attributes (e.g., color: red, size: large)"),
          stockQuantity: z
            .number()
            .int()
            .min(0)
            .describe("Stock quantity for this variant"),
          images: z
            .array(ImageSchema)
            .optional()
            .describe("Images specific to this variant"),
          thumbnail: ImageSchema.optional().describe(
            "Main image for this variant",
          ),
          weight: z
            .number()
            .positive()
            .optional()
            .describe("Weight of this variant"),
          weightUnit: z
            .string()
            .optional()
            .describe("Unit of weight measurement"),
          dimensions: DimensionsSchema.optional().describe(
            "Physical dimensions of this variant",
          ),
        }),
      )
      .optional()
      .describe("Product variants (required for configurable products)"),
    weight: z
      .number()
      .positive()
      .optional()
      .describe("Product weight for shipping calculations"),
    weightUnit: z.string().optional().describe("Unit of weight (kg, lb, etc.)"),
    dimensions: DimensionsSchema.optional().describe(
      "Product dimensions for shipping",
    ),
    seo: SeoSchema.optional().describe("Search engine optimization settings"),
    createdById: z.string().describe("ID of the user creating this product"),
    updatedById: z
      .string()
      .optional()
      .describe("ID of the user who last updated this product"),
  })
  .superRefine((data: any, ctx: any) => {
    if (
      data.type === "configurable" &&
      (!data.variants || data.variants.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Configurable products require at least one variant when being created.",
        path: ["variants"],
      });
    }
  });

export const UpdateProductDtoSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .optional()
      .describe("The product name as it will appear on the website"),
    description: z
      .string()
      .min(1)
      .optional()
      .describe("Detailed description of the product for customers"),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional()
      .describe("URL-friendly version of the product name"),
    price: z
      .number()
      .positive()
      .optional()
      .describe("Base price of the product"),
    currency: z
      .string()
      .length(3)
      .optional()
      .describe("Three-letter currency code"),
    discountPercentage: z
      .number()
      .min(0)
      .max(100)
      .optional()
      .describe("Percentage discount to apply"),
    discountFixedAmount: z
      .number()
      .positive()
      .optional()
      .describe("Fixed amount discount"),
    discountStartDate: z
      .string()
      .datetime()
      .optional()
      .describe("When the discount becomes active"),
    discountEndDate: z
      .string()
      .datetime()
      .optional()
      .describe("When the discount expires"),
    categoryId: z
      .string()
      .optional()
      .describe("Category this product belongs to"),
    brand: z.string().min(1).optional().describe("Brand or manufacturer name"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Keywords for product discovery"),
    images: z.array(ImageSchema).min(1).optional().describe("Product images"),
    thumbnail: ImageSchema.optional().describe("Main product image"),
    type: ProductTypeSchema.optional().describe("Product type"),
    status: ProductStatusSchema.optional().describe("Product status"),
    visibility:
      ProductVisibilitySchema.optional().describe("Product visibility"),
    condition: ProductConditionSchema.optional().describe("Product condition"),
    featured: z.boolean().optional().describe("Featured product status"),
    stockQuantity: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe("Available inventory"),
    isInStock: z
      .boolean()
      .default(true)
      .describe("Whether product is in stock"),
    weight: z.number().positive().optional().describe("Product weight"),
    weightUnit: z.string().optional().describe("Weight unit"),
    dimensions: DimensionsSchema.optional().describe("Product dimensions"),
    seo: SeoSchema.optional().describe("SEO settings"),
    updatedById: z.string().optional().describe("ID of user making the update"),
  })
  .superRefine((data: any, ctx: any) => {
    if (data.type && data.type === "configurable") {
      if (data.variants && data.variants.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Configurable products must retain at least one variant.",
          path: ["variants"],
        });
      }
    }
  });

export const ProductResponseDtoSchema = ProductSchema;

export const CreateProductCategoryDtoSchema = z.object({
  name: z
    .string()
    .min(1)
    .describe("Category name as it will appear to customers"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .describe("URL-friendly category identifier"),
  description: z
    .string()
    .optional()
    .describe("Category description for SEO and customer information"),
  parentId: z
    .string()
    .optional()
    .describe("Parent category ID for hierarchical organization"),
  image: ImageSchema.optional().describe(
    "Category image for visual representation",
  ),
  seo: SeoSchema.optional().describe(
    "SEO optimization settings for this category",
  ),
});

export const UpdateProductCategoryDtoSchema = z.object({
  name: z.string().min(1).optional().describe("Category name"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .describe("URL-friendly category identifier"),
  description: z.string().optional().describe("Category description"),
  parentId: z.string().optional().describe("Parent category ID"),
  image: ImageSchema.optional().describe("Category image"),
  seo: SeoSchema.optional().describe("SEO settings"),
  updatedAt: z.string().datetime().optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductDtoSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductDtoSchema>;
export type ProductResponseDto = z.infer<typeof ProductResponseDtoSchema>;
export type CreateProductCategoryDto = z.infer<
  typeof CreateProductCategoryDtoSchema
>;
export type UpdateProductCategoryDto = z.infer<
  typeof UpdateProductCategoryDtoSchema
>;
export type ProductCategoryResponseDto = z.infer<typeof ProductCategorySchema>;
