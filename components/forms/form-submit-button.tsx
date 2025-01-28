"use client"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export function FormSubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} isLoading={pending}>
      {children}
    </Button>
  )
}

