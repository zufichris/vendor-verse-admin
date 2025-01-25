import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getToken } from "./actions/auth"
import { IResponseData } from "./types/global"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function request<T = IResponseData<unknown>>(path = '/', init?: RequestInit): Promise<T> {
  try {
    const url = new URL(`/api/v1/${path}`, process.env.NEXT_PUBLIC_ADMIN_BASE_URL).toString()
    const access_token = await getToken("access_token")
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        authorization: access_token ? `Bearer ${access_token}` : "",
      },
      method: "GET",
      ...init,
    })
    const data = await res.json()
    return data as T
  } catch (error) {
    throw error
  }
}