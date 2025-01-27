'use client'
import { AlertCircle, Ban, FileWarning, Terminal } from "lucide-react"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface ErrorMessageProps {
    readonly message: string
    readonly description?: string
    readonly status?: number
    readonly showHomeLink?: boolean
    readonly className?: string
}

export function ErrorMessage({
    message,
    description,
    status,
    showHomeLink = true,
    className,
}: ErrorMessageProps) {
    const getErrorDetails = (status?: number) => {
        switch (status) {
            case 404:
                return {
                    icon: FileWarning,
                    variant: "default" as const,
                    defaultDescription: "The requested resource could not be found.",
                }
            case 403:
                return {
                    icon: Ban,
                    variant: "destructive" as const,
                    defaultDescription: "You do not have permission to access this resource.",
                }
            case 500:
                return {
                    icon: Terminal,
                    variant: "destructive" as const,
                    defaultDescription: "An internal server error occurred.",
                }
            default:
                return {
                    icon: AlertCircle,
                    variant: "destructive" as const,
                    defaultDescription: "An unexpected error occurred.",
                }
        }
    }

    const { icon: Icon, variant, defaultDescription } = getErrorDetails(status)

    return (
        <Card className={className}>
            <CardHeader>
                <Alert variant={variant}>
                    <Icon className="h-4 w-4" />
                    <AlertTitle>{message}</AlertTitle>
                    <AlertDescription>{description ?? defaultDescription}</AlertDescription>
                </Alert>
            </CardHeader>
            <CardContent>{status && <p className="text-sm text-muted-foreground"> {status}</p>}</CardContent>
            <CardFooter className="flex justify-end gap-4">
                {showHomeLink && (
                    <Button variant="outline" asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

