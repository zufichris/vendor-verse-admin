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
import type { Banner } from "@/types/product.types"
import { deleteBanner } from "@/lib/actions/banner.actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface DeleteBannerModalProps {
  banner: Banner | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteBannerModal({ banner, open, onOpenChange }: DeleteBannerModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    if (!banner) return

    setIsDeleting(true)
    try {
      const result = await deleteBanner(banner.id)

      if (result.success) {
        toast({
          title: "Banner Deleted",
          description: `${banner.title} has been permanently deleted.`,
        })
        onOpenChange(false)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete banner",
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

  if (!banner) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              This action cannot be undone. This will permanently delete the banner{" "}
              <span className="font-semibold text-primary">"{banner.title}"</span> and remove it from all locations
              where it's currently displayed.
            </p>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                <strong>Banner Details:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Title: {banner.title}</li>
                <li>• Subtitle: {banner.subtitle}</li>
                <li>• CTA: {banner.cta}</li>
                <li>• Link: {banner.link}</li>
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
              "Delete Banner"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
