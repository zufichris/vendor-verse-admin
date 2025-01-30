"use client"

import * as React from "react"
import NextImage, { type ImageProps as NextImageProps } from "next/image"
import { ImageOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface ImageProps extends Omit<NextImageProps, "onError" | "onLoad"> {
    readonly fallbackClassName?: string
    readonly fallback?: React.ReactNode
}

export function Image({ className, fallbackClassName, alt, fill, width, height, fallback, ...props }: ImageProps) {
    const [isLoading, setIsLoading] = React.useState(true)
    const [hasError, setHasError] = React.useState(false)
    const [dimensions, setDimensions] = React.useState({
        width: width ?? "100%",
        height: height ?? "100%",
    })

    React.useEffect(() => {
        setIsLoading(true)
        setHasError(false)
    }, [])

    React.useEffect(() => {
        if (fill) {
            setDimensions({ width: "100%", height: "100%" })
        } else {
            setDimensions({
                width: width ?? "auto",
                height: height ?? "auto",
            })
        }
    }, [fill, width, height])

    if (hasError) {
        return (
            <div
                className={cn("flex items-center justify-center bg-muted", fallbackClassName, className)}
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    minWidth: width ?? "auto",
                    minHeight: height ?? "auto",
                }}
                aria-label={alt}
            >
                {fallback ?? <ImageOff className="h-6 w-6 text-muted-foreground" />}
            </div>
        )
    }

    return (
        <div
            className={cn("relative", !fill && "inline-block")}
            style={{
                width: dimensions.width,
                height: dimensions.height,
                minWidth: width ?? "auto",
                minHeight: height ?? "auto",
            }}
        >
            {isLoading && <Skeleton className={cn("absolute inset-0", fallbackClassName)} />}
            <NextImage
                className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", className)}
                alt={alt}
                width={fill ? undefined : (width as number)}
                height={fill ? undefined : (height as number)}
                fill={fill}
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => setHasError(true)}
                sizes={fill ? "100vw" : undefined}
                {...props}
            />
        </div>
    )
}

