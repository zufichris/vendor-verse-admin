import { z } from "zod"

export const CreateVariantDtoSchema = z.object({
    productId: z.string().describe("ID of the parent product"),
    sku: z.string().min(1).max(50).describe("Unique SKU for this variant"),
    name: z.string().optional().describe("Display name for this variant"),
    price: z.number().positive().describe("Price for this specific variant"),
    currency: z.string().length(3).describe("Currency code for variant pricing"),
    discountPrice: z.number().positive().optional().describe("Discounted price for this variant"),
    discountPercentage: z.number().min(0).max(100).optional().describe("Percentage discount for variant"),
    discountFixedAmount: z.number().positive().optional().describe("Fixed discount amount for variant"),
    attributes: z
        .record(z.string(), z.string())
        .optional()
        .describe("Variant attributes (e.g., color: red, size: large)"),
    stockQuantity: z.number().int().min(0).describe("Stock quantity for this variant"),
    images: z
        .array(
            z.object({
                url: z.string().url(),
                altText: z.string().optional(),
            }),
        )
        .optional()
        .describe("Images specific to this variant"),
    thumbnail: z
        .object({
            url: z.string().url(),
            altText: z.string().optional(),
        })
        .optional()
        .describe("Main image for this variant"),
    weight: z.number().positive().optional().describe("Weight of this variant"),
    weightUnit: z.string().optional().describe("Unit of weight measurement"),
    dimensions: z
        .object({
            length: z.number().positive(),
            width: z.number().positive(),
            height: z.number().positive(),
            unit: z.string().optional(),
        })
        .optional()
        .describe("Physical dimensions of this variant"),
})

export const UpdateVariantDtoSchema = CreateVariantDtoSchema.partial().omit({ productId: true })

export type CreateVariantDto = z.infer<typeof CreateVariantDtoSchema>
export type UpdateVariantDto = z.infer<typeof UpdateVariantDtoSchema>


