import { z } from "zod"

// Image schema matching MongoDB definition
export const ImageSchema = z.object({
    url: z.url("Must be a valid URL"),
    altText: z.string().optional(),
})

// Currency options
export const CurrencyEnum = z.enum(["AED"])

// Dimensions schema
export const DimensionsSchema = z.object({
    length: z.coerce.number().min(0, "Length must be positive"),
    width: z.coerce.number().min(0, "Width must be positive"),
    height: z.coerce.number().min(0, "Height must be positive"),
    unit: z.enum(["cm", "m", "in", "ft"]),
})

// Attributes (custom key-value pairs)
export const AttributesSchema = z.record(z.string(), z.string())

// Main variant schema
export const ProductVariantSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    sku: z.string().toUpperCase().optional(),
    name: z.string(),
    price: z.coerce.number().min(0, "Price must be zero or positive"),
    currency: CurrencyEnum,
    stockQuantity: z.coerce.number().min(0, "Stock must be zero or positive").int(),
    isInStock: z.boolean(),
    weight: z
        .union([z.coerce.number().min(0, "Weight must be positive"), z.literal("").transform(() => 0)])
        .optional(),
    thumbnail: ImageSchema,
    images: z.array(ImageSchema),
    dimensions: DimensionsSchema.optional(),
    attributes: AttributesSchema,
})

export type ProductVariant = z.infer<typeof ProductVariantSchema>
