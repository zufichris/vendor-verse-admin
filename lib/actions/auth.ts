"use server";

import { request } from "../utils";

export function signIn({ email, password }: { email: string, password: string }) {
    return request("/auth/signin", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}