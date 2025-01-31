import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
    cookies().delete("access_token")
    cookies().delete("refresh_token")
    return NextResponse.redirect(new URL("/signin", process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"))
}

