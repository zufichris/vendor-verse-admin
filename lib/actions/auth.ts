"use server";

import { request } from "../utils";

export async function signIn({ email, password }: { email: string, password: string }) {
    try {
        const data = request("/auth/signin", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        });
        return data;
    } catch (error) {
        throw error
    }
}