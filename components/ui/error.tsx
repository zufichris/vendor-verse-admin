'use client'
import { AlertCircle, ArrowLeft, Ban, FileWarning, RotateCcw, Terminal } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useParams, useRouter, useSearchParams } from "next/navigation"

interface ErrorMessageProps {
    readonly message: string
    readonly description?: string
    readonly status?: number
    readonly className?: string,
}

export function ErrorMessage({
    message,
    description,
    status,
    className,
}: ErrorMessageProps) {
    const router = useRouter()
    const { icon: Icon, variant, defaultDescription } = getErrorDetails(status)

    return (
        <Card className={cn("animate-in fade-in-0 zoom-in-95 duration-300 sm:w-1/2 w-full mx-auto py-4 mt-4", className)}>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className={cn("rounded-full p-3", variant === "destructive" ? "bg-destructive/10" : "bg-muted")}>
                        <Icon className={cn("h-8 w-8", variant === "destructive" ? "text-destructive" : "text-foreground")} />
                    </div>
                    <Alert variant={variant}>
                        <div className="space-y-2">
                            <AlertTitle className="text-lg font-semibold tracking-tight">{message}</AlertTitle>
                            <AlertDescription className="text-sm leading-relaxed">
                                {description ?? defaultDescription}
                            </AlertDescription>
                        </div>
                    </Alert>
                    {status && (
                        <p
                            className={cn(
                                "text-sm font-medium rounded-full px-2 py-0.5",
                                variant === "destructive" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground",
                            )}
                        >
                            Error {status}
                        </p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4 pb-6">
                <Button onClick={router.back} className="transition-colors">
                    <ArrowLeft />Back
                </Button>
                <Button variant="outline" onClick={router.refresh} className="group">
                    <RotateCcw className="ml-2 h-4 w-4 transition-transform group-hover:rotate-180" />
                    Try Again
                </Button>
            </CardFooter>
        </Card>
    )
}

function getErrorDetails(status?: number) {
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


