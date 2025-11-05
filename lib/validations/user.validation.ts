import { Gender, UserRole, UserStatus } from "@/types/user.types";
import z from "zod";

export const CreateUserSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().optional(),
    dateOfBirth: z.date().optional(),
    gender: z.enum(Gender).optional(),
    role: z.enum(UserRole),
    referredBy: z.string().optional(),
    marketingConsent: z.boolean().optional(),
});

export const UpdateUserSchema = z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: z.string().optional(),
    dateOfBirth: z.date().optional(),
    gender: z.enum(Gender).optional(),
    role: z.enum(UserRole).optional(),
    status: z.enum(UserStatus).optional(),
    profileImage: z.string().optional(),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>