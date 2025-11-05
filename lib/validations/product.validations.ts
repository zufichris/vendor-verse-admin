import { z } from "zod"
export enum SupportedSizes {
    XXS = "XXS",
    XS = "XS",
    S = "S",
    M = "M",
    L = "L",
    XL = "XL",
    XXL = "XXL",
    XXXL = "XXXL"
}

export const CreateVariantDtoSchema = z.object({
    productId: z.string().describe("ID of the parent product"),
    sku: z.string().min(1).max(50).describe("Unique SKU for this variant"),
    name: z.string().describe("Display name for this variant"),
    colorCode: z.string(), // valid hex color code
    price: z.coerce.number().positive().describe("Price for this specific variant"),
    currency: z.string().length(3).describe("Currency code for variant pricing"),
    discountPrice: z.coerce.number().min(0).optional().describe("Discounted price for this variant"),
    discountPercentage: z.coerce.number().min(0).max(100).optional().describe("Percentage discount for variant"),
    discountFixedAmount: z.coerce.number().min(0).optional().describe("Fixed discount amount for variant"),
    sizes: z.array(z.enum(SupportedSizes)),
    attributes: z.record(z.string(), z.string())
        .optional()
        .describe("Variant attributes (e.g., color: red, size: large)"),
    stockQuantity: z.coerce.number().int().min(0).describe("Stock quantity for this variant"),
    images: z
        .array(
            z.object({
                url: z.url(),
                altText: z.string().optional(),
            }),
        )
        // .optional()
        .describe("Images specific to this variant"),
    thumbnail: z
        .object({
            url: z.url(),
            altText: z.string().optional(),
        })
        // .optional()
        .describe("Main image for this variant"),
    weight: z.coerce.number().min(0).optional().describe("Weight of this variant"),
    weightUnit: z.string().optional().describe("Unit of weight measurement"),
    dimensions: z
        .object({
            length: z.coerce.number().min(0),
            width: z.coerce.number().min(0),
            height: z.coerce.number().min(0),
            unit: z.string().optional(),
        })
        .optional()
        .describe("Physical dimensions of this variant"),
})

export const UpdateVariantDtoSchema = CreateVariantDtoSchema.partial().omit({ productId: true })

export type CreateVariantDto = z.infer<typeof CreateVariantDtoSchema>
export type UpdateVariantDto = z.infer<typeof UpdateVariantDtoSchema>


