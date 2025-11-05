import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address." })
        .min(1, { message: "Email is required." }),
    password: z.string().min(1, { message: "Password is required." }),
    rememberMe: z.boolean().default(false).optional(),
});

export const registerSchema = z
    .object({
        firstName: z.string().min(1, { message: "First name is required." }),
        lastName: z.string().min(1, { message: "Last name is required." }),
        email: z
            .string()
            .email({ message: "Invalid email address." })
            .min(1, { message: "Email is required." }),
        password: z
            .string()
            .min(8, {
                message: "Password must be at least 8 characters long.",
            })
            .regex(/[A-Z]/, {
                message: "Password must contain at least one uppercase letter.",
            })
            .regex(/[0-9]/, { message: "Password must contain at least one number." })
            .regex(/[^a-zA-Z0-9]/, {
                message: "Password must contain at least one special character.",
            }),
        confirmPassword: z.string().min(1, {
            message: "Confirm Password is required.",
        }),
        agreeToTerms: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    })
    // ADD THIS REFINE for agreeToTerms
    .refine((data) => data.agreeToTerms === true, {
        message: "You must agree to the Terms of Service and Privacy Policy.",
        path: ["agreeToTerms"], // Attach error to the field
    });

export const forgotPasswordEmailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

export const forgotPasswordResetSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z.string(),
        otpCode: z.string().length(6, "OTP code must be 6 digits"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export const confirmPasswordResetSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export type ForgotPasswordEmailInput = z.infer<typeof forgotPasswordEmailSchema>
export type ForgotPasswordResetInput = z.infer<typeof forgotPasswordResetSchema>
export type ConfirmPasswordResetInput = z.infer<typeof confirmPasswordResetSchema>
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
