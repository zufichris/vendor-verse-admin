import * as z from "zod"

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  brand: z.string().optional(),
  category: z.string().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  sku: z.string().min(1, "SKU is required"),
  status: z.enum(["draft", "published"]),
  currency: z.string().optional(),
  trackInventory: z.boolean().optional(),
  variants: z.array(
    z.object({
      name: z.string(),
      values: z.array(z.string()),
    }),
  ),
  variantProducts: z
    .array(
      z.object({
        id: z.string(),
        combination: z.record(z.string(), z.string()),
        price: z.string(),
        stock: z.number(),
        sku: z.string(),
      }),
    )
    .optional()
    .default([]),
  tags: z.array(z.string()).optional().default([]),
  images: z
    .array(
      z.object({
        id: z.string(),
        url: z.string(),
        alt: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
  }),
  products: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0, "Price cannot be negative"),
      }),
    )
    .min(1, "At least one product is required"),
  shippingAddress: z.object({
    street: z.string().min(5, "Street address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),
  }),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer"]),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
})

export const vendorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  website: z.string().url("Invalid website URL").optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  address: z.object({
    street: z.string().min(5, "Street address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),
  }),
  taxId: z.string().min(1, "Tax ID is required"),
  status: z.enum(["pending", "active", "inactive"]),
})

