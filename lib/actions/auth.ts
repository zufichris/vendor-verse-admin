"use server";

import { cookies } from "next/headers";
import { IResponseData } from "../types/global";
import { TUser } from "../types/user";
import { request } from "../utils";

export async function signIn({ email, password }: { email: string, password: string }) {
    try {
        const data = await request<IResponseData<TUser>>("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        });
        if (data.success && data.data.tokenPair) {
            setCookie("access_token", data.data.tokenPair?.accessToken!)
            setCookie("refresh_token", data.data.tokenPair?.refreshToken!)
        }
        return data;
    } catch (error) {
        throw error
    }
}
export async function googleSignIn(code: string) {
    try {
        const data = await request<IResponseData<TUser>>(`/auth/google/callback?code=${code}`)
        if (data.success && data.data.tokenPair) {
            setCookie("access_token", data.data.tokenPair?.accessToken!)
            setCookie("refresh_token", data.data.tokenPair?.refreshToken!)
        }
        return data;
    } catch (error) {
        throw error
    }
}

export async function logout() {
    const cookieStore = cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
}
export async function getToken(type: 'access_token' | 'refresh_token'): Promise<string | null> {
    const cookieStore = cookies()
    return cookieStore.get(type)?.value || null
}
export async function setCookie(type: 'access_token' | 'refresh_token', value: string) {
    const cookieStore = await cookies()
    cookieStore.set(type, value)
}