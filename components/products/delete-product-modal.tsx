"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Product } from "@/types/product.types";
import { deleteProduct } from "@/lib/actions/product.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface DeleteProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProductModal({
  product,
  open,
  onOpenChange,
}: DeleteProductModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!product) return;

    setIsDeleting(true);
    try {
      const result = await deleteProduct(product.id);

      if (result.success) {
        toast({
          title: "Product Deleted",
          description: `${product.name} has been permanently deleted.`,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete product",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!product) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>
              This action cannot be undone. This will permanently delete the
              product{" "}
              <span className="font-semibold text-primary">
                "{product.name}"
              </span>{" "}
              and remove all associated data from our servers.
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm">
                <strong>Product Details:</strong>
              </div>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• SKU: {product.sku}</li>
                <li>• Category: {product.category.name}</li>
                <li>• Current Stock: {product.stockQuantity} units</li>
                {product.variants && product.variants.length > 0 && (
                  <li>
                    • Variants: {product.variants.length} variants will also be
                    deleted
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
              "Delete Product"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
