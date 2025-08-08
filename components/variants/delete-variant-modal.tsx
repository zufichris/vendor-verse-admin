"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ProductVariant } from "@/types/product.types"
import { deleteVariant } from "@/lib/actions/variant.actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface DeleteVariantModalProps {
  variant: ProductVariant | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteVariantModal({ variant, open, onOpenChange }: DeleteVariantModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    if (!variant) return

    setIsDeleting(true)
    try {
      const result = await deleteVariant(variant.id)

      if (result.success) {
        toast({
          title: "Variant Deleted",
          description: `${variant.name || variant.sku} has been permanently deleted.`,
        })
        onOpenChange(false)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete variant",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (!variant) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              This action cannot be undone. This will permanently delete the variant{" "}
              <span className="font-semibold text-primary">"{variant.name || variant.sku}"</span> and remove all
              associated data.
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                <strong>Variant Details:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• SKU: {variant.sku}</li>
                <li>
                  • Price: ${variant.price.toFixed(2)} {variant.currency}
                </li>
                <li>• Stock: {variant.stockQuantity} units</li>
                {variant.attributes && (
                  <li>
                    • Attributes:{" "}
                    {Object.entries(variant.attributes)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(", ")}
                  </li>
                )}
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Variant"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
