"use client"

import { useEffect } from "react"
import { ErrorMessage } from "@/components/ui/error"

interface ErrProps {
    readonly error: Error
}
export default function ErrorPage({
    error,
}: ErrProps) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <ErrorMessage message="An Unexpected Error Occurred" status={502} />
    )
}

