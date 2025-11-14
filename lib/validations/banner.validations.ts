import { z } from "zod"

export const bannerSchema = z.object({
    title: z.string().min(1, "Title is required").trim(),
    subtitle: z.string().min(1, "Subtitle is required").toLowerCase(),
    slug: z
        .string()
        .min(1, "Slug is required")
        .toLowerCase()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and hyphenated"),
    description: z.string().optional(),
    cta: z.string().optional(),
    image: z.string().optional(),
    video: z.string().optional(),
    color: z.string().optional(),
    link: z.string().optional(),
})

export type BannerFormValues = z.infer<typeof bannerSchema>
