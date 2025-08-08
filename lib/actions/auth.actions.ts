"use server";

import { cookies } from "next/headers";
import {
    loginSchema,
    registerSchema,
    LoginInput,
    RegisterInput,
} from "../validations/auth.validations";
import { Api, ApiResponse } from "@/utils/api";
import { User } from "@/types/user.types";

interface AuthData {
    accessToken: string;
    expiresIn: number;
    user?: User;
}

export async function getLoggedInUser() {
    const result = await Api.get<User>("/users/me");
    return result;
}
export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken");
    return token?.value || null;
}
export async function loginAction(
    formData: LoginInput,
): Promise<ApiResponse<AuthData>> {
    const parsed = loginSchema.safeParse(formData);

    if (!parsed.success) {
        return {
            data: null,
            success: false,
            status: 400,
            message: parsed.error.issues[0].message,
        };
    }
    const { email, password } = parsed.data;
    const result = await Api.post<AuthData>("/users/login", {
        email,
        password,
    });

    if (result.success && result.data?.accessToken) {
        const cookieStore = await cookies();

        cookieStore.set("accessToken", result.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: result.data.expiresIn,
            path: "/",
        });

        return {
            data: result.data,
            success: true,
            status: 200,
            message: "Login successful!",
        };
    } else {
        return {
            data: null,
            success: false,
            status: result.status,
            message: result.message || "Login failed. Please try again.",
        };
    }
}

export async function registerAction(
    formData: RegisterInput,
): Promise<ApiResponse<AuthData>> {
    const parsed = registerSchema.safeParse(formData);

    if (!parsed.success) {
        return {
            data: null,
            success: false,
            status: 400,
            message: parsed.error.issues[0].message,
        };
    }
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        agreeToTerms,
    } = parsed.data;
    const result = await Api.post<AuthData>("/users/register", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        agreeToTerms,
    });
    if (result.success && result.data?.accessToken) {
        const cookieStore = await cookies();
        cookieStore.set("accessToken", result.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: result.data.expiresIn,
            path: "/",
        });

        return {
            data: result.data,
            success: true,
            status: 201,
            message: "Registration successful!",
        };
    } else {
        return {
            data: null,
            success: false,
            status: result.status,
            message: result.message || "Registration failed. Please try again.",
        };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
}
