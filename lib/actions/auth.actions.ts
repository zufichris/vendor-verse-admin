"use server";

import { cookies } from "next/headers";
import {
    loginSchema,
    registerSchema,
    LoginInput,
    RegisterInput,
    ForgotPasswordEmailInput,
    ForgotPasswordResetInput,
    ConfirmPasswordResetInput,
} from "../validations/auth.validations";
import { Api, ApiResponse } from "@/utils/api";
import { User } from "@/types/user.types";
import { redirect } from "next/navigation";

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
    formData: LoginInput & { callbackUrl?: string },
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


export const verifyOtp = async (data: { email?: string; userId?: string; otp: string, callbackUrl?: string }) => {
    const result = await Api.post<AuthData>('/users/verify-email', {
        ...data,
        token: data.otp
    })

    if (result.success && result.data?.accessToken) {
        const cookieStore = await cookies();

        cookieStore.set("accessToken", result.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: result.data.expiresIn,
            path: "/",
        });
    }

    return result

}

export const resendVerification = async (data: { email?: string; userId?: string; }) => {
    const result = await Api.post<boolean>('/users/resend-verification', data)

    return result
}


export const passwordResetRequest = async (data: ForgotPasswordEmailInput) => {
    return await Api.post('/users/password-reset/request', data)
}

export const confirmPasswordReset = async (data: ForgotPasswordResetInput &
    ConfirmPasswordResetInput & { email?: string; userId?: string }) => {
    console.log(data)
    return await Api.post('/users/password-reset/confirm', {
        ...data,
        token: data.otpCode
    })
}

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    return Api.post('/users/change-password', data)
}
