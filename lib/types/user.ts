import { z } from "zod";

export const OAuthSchema = z.object({
    provider: z.string().nullable().optional(),
    oauthId: z.string(),
})
export const UserSchema = z.object({
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


export type TUser = z.infer<typeof UserSchema>;