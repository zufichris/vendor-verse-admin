import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function request<T>(path = '/', init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${process.env.NEXT_ADMIN_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
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