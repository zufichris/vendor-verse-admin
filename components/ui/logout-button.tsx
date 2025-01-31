"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }
    return (
        <Button onClick={handleLogout} variant="destructive">
            Logout
        </Button>
    )
}

