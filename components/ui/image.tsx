'use client'

import * as React from "react"
import NextImage, { ImageProps as NextImageProps } from "next/image"
import { ImageOff } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface ImageProps extends Omit<NextImageProps, "onError" | "onLoad"> {
    fallbackClassName?: string
}

export function Image({ className, fallbackClassName, alt, ...props }: ImageProps) {
    const [isLoading, setIsLoading] = React.useState(true)
    const [hasError, setHasError] = React.useState(false)

    React.useEffect(() => {
        setIsLoading(true)
        setHasError(false)
    }, [props.src])

    if (hasError) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center bg-muted",
                    fallbackClassName,
                    className
                )}
                style={{ width: props.width, height: props.height }}
                aria-label={alt}
            >
                <ImageOff className="h-6 w-6 text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="relative" style={{ width: props.width, height: props.height }}>
            {isLoading && (
                <Skeleton
                    className={cn("absolute inset-0", fallbackClassName)}
                    style={{ width: props.width, height: props.height }}
                />
            )}
            <NextImage
                className={cn(isLoading ? "invisible" : "", className)}
                alt={alt}
                onLoad={() => setIsLoading(false)}
                onError={() => setHasError(true)}
                {...props}
            />
        </div>
    )
}
