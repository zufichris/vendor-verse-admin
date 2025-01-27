import { z } from "zod";

export const OAuthSchema = z.object({
    provider: z.string().nullable().optional(),
    oauthId: z.string(),
})
export const BasicUserSchema = z.object({
    id: z.string().optional(),
    custId: z.string().optional(),
    email: z.string().email(),
    password: z.string().nullable().optional(),
    isEmailVerified: z.boolean(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
    oauth: OAuthSchema.nullable().optional(),
    tokenPair: z.object({
        provider: z.string().nullable().optional(),
        accessToken: z.string().nullable().optional(),
        refreshToken: z.string().nullable().optional()
    }).nullable().optional(),
    externalProvider: z.string().nullable().optional(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    profilePictureUrl: z.object({
        external: z.boolean(),
        url: z.string()
    }).nullable().optional(),
    roles: z.string().array().nullable().optional(),
    isActive: z.boolean(),
});





export const AddressSchema = z.object({
    street: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    postalCode: z.string().nullable().optional(),
})

export const BillingSchema = z.object({
    plan: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    lastPayment: z.date().nullable().optional(),
    paymentMethod: z.string().nullable().optional(),
})

export const UserSchema = BasicUserSchema.extend({
    dateOfBirth: z.date().nullable().optional(),
    gender: z.string().nullable().optional(),
    company: z.string().nullable().optional(),
    jobTitle: z.string().nullable().optional(),
    preferredLanguage: z.string().nullable().optional(),
    communicationPreferences: z.array(z.string()).nullable().optional(),
    address: AddressSchema.nullable().optional(),
    billing: BillingSchema.nullable().optional(),
    lastLoginAt: z.date().nullable().optional(),
    totalOrders: z.number().nullable().optional(),
    lifetimeValue: z.number().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    notes: z.string().nullable().optional(),
})

export type TUser = z.infer<typeof UserSchema>

