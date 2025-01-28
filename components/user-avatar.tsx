"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

const avatarSizes = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-14 w-14 text-xl",
} as const

const avatarVariants = cva(
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full select-none uppercase transition-transform hover:scale-105",
    {
        variants: {
            size: avatarSizes,
            active: {
                true: "ring-2 ring-primary ring-offset-2",
            },
            interactive: {
                true: "cursor-pointer hover:opacity-90",
            },
        },
        defaultVariants: {
            size: "md",
            active: false,
            interactive: false,
        },
    },
)

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
    readonly src?: string | null
    readonly firstName?: string
    readonly lastName?: string
    readonly alt?: string
    readonly className?: string
    readonly onClick?: () => void
    readonly loading?: boolean
}

export function UserAvatar({
    src,
    firstName,
    lastName,
    alt,
    size = "md",
    active,
    className,
    onClick,
    loading = false,
}: UserAvatarProps) {
    const [error, setError] = useState(false)
    const fallback = getFallback(firstName, lastName)
    const [showFallback, setShowFallback] = useState(true)

    useEffect(() => {
        setShowFallback(error || !src)
    }, [error, src])
    if (loading) {
        return <Skeleton className={cn(avatarSizes[size ?? "md"], "rounded-full", className)} />
    }

    return (
        <Avatar onClick={onClick} className={cn(avatarVariants({ size, active }), className)}>
            {!showFallback && (
                <AvatarImage src={src ?? ""} alt={alt ?? `Avatar for ${firstName ?? "user"}`} onError={() => setError(true)} />
            )}
            <AvatarFallback
                className={cn(
                    "h-full w-full rounded-full",
                    "bg-gradient-to-br from-muted/50 to-muted",
                    showFallback ? "block" : "hidden",
                )}
                delayMs={100}
            >
                <div className="h-full w-full flex items-center justify-center">{fallback}</div>
            </AvatarFallback>
        </Avatar>
    )
}

function getFallback(firstName?: string, lastName?: string): string {
    if (!firstName?.length) return "?"

    if (lastName?.length) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`
    }

    return `${firstName.charAt(0)}${firstName.charAt(firstName.length - 1)}`
}

