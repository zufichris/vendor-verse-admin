import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { googleSignIn } from "@/lib/actions/auth"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
        return NextResponse.redirect(new URL("/signin?error=invalid_code", request.url))
    }

    try {
        const res = await googleSignIn(code)
        if (!res.success) {
            return NextResponse.redirect(`/signin?error=${res.message}`)
        }
        const { accessToken, refreshToken } = res.data.tokenPair!
        if (accessToken && refreshToken) {
            cookies().set("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            })

            cookies().set("refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            })

            return NextResponse.redirect(new URL("/", request.url))
        }
        return NextResponse.redirect(new URL("/signin?error=auth_failed", request.url))
    } catch (error) {
        console.error("Authentication error:", error)
        return NextResponse.redirect(new URL("/signin?error=auth_failed", request.url))
    }
}

