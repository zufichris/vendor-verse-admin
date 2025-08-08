"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal, Edit, Trash2, Copy, Eye, ToggleLeft, ToggleRight, Search, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import type { ProductVariant } from "@/types/product.types"
import type { PaginationResult } from "@/types/pagination.types"
import { DeleteVariantModal } from "@/components/variants/delete-variant-modal"
import { toggleVariantStock, duplicateVariant } from "@/lib/actions/variant.actions"
import { useToast } from "@/hooks/use-toast"

interface VariantsTableProps {
  productId: string
  paginatedVariants: PaginationResult<ProductVariant>
}

export function VariantsTable({ productId, paginatedVariants }: VariantsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }
    params.set("page", "1")
    router.push(`/admin/products/${productId}/variants?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/admin/products/${productId}/variants?${params.toString()}`)
  }

  const handleToggleStock = async (variant: ProductVariant) => {
    const newStockStatus = !variant.isInStock
    const result = await toggleVariantStock(variant.id, newStockStatus)

    if (result.success) {
      toast({
        title: "Stock Status Updated",
        description: `Variant ${variant.name || variant.sku} is now ${newStockStatus ? "in stock" : "out of stock"}`,
      })
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update variant stock status",
        variant: "destructive",
      })
    }
  }

  const handleDuplicate = async (variant: ProductVariant) => {
    const result = await duplicateVariant(variant.id)

    if (result.success) {
      toast({
        title: "Variant Duplicated",
        description: `${variant.name || variant.sku} has been duplicated successfully`,
      })
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to duplicate variant",
        variant: "destructive",
      })
    }
  }

  const getStockBadge = (variant: ProductVariant) => {
    if (!variant.isInStock || variant.stockQuantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (variant.stockQuantity < 5) {
      return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>
    }
    return <Badge className="bg-success text-success-foreground">In Stock</Badge>
  }

  const formatAttributes = (attributes: Record<string, string> | undefined) => {
    if (!attributes) return null
    return Object.entries(attributes).map(([key, value]) => (
      <Badge key={key} variant="outline" className="text-xs mr-1">
        {key}: {value}
      </Badge>
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              placeholder="Search variants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
              className="w-64 pr-10"
            />
            <Button size="sm" variant="ghost" className="absolute right-0 top-0 h-full px-3" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {paginatedVariants.data.length} of {paginatedVariants.filterCount} variants
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Attributes</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVariants.data.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>
                  <div className="relative h-16 w-16 rounded-md overflow-hidden">
                    <Image
                      src={variant.thumbnail?.url || "/placeholder.svg"}
                      alt={variant.thumbnail?.altText || variant.name || variant.sku}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-primary">{variant.name || "Unnamed Variant"}</div>
                    {variant.weight && (
                      <div className="text-sm text-muted-foreground">
                        Weight: {variant.weight} {variant.weightUnit || "kg"}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{variant.sku}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">{formatAttributes(variant.attributes)}</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      ${variant.price.toFixed(2)} {variant.currency}
                    </div>
                    {variant.discountPercentage && (
                      <div className="text-sm text-muted-foreground">{variant.discountPercentage}% off</div>
                    )}
                    {variant.discountPrice && (
                      <div className="text-sm text-success">Sale: ${variant.discountPrice.toFixed(2)}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{variant.stockQuantity} units</div>
                    {getStockBadge(variant)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={variant.isInStock ? "default" : "secondary"}>
                    {variant.isInStock ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${productId}/variants/${variant.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${productId}/variants/${variant.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Variant
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleStock(variant)}>
                        {variant.isInStock ? (
                          <>
                            <ToggleLeft className="mr-2 h-4 w-4" />
                            Mark Out of Stock
                          </>
                        ) : (
                          <>
                            <ToggleRight className="mr-2 h-4 w-4" />
                            Mark In Stock
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(variant)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setSelectedVariant(variant)
                          setDeleteModalOpen(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {paginatedVariants.data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No variants found matching your criteria.</p>
          <Button asChild className="mt-4">
            <Link href={`/admin/products/${productId}/variants/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Variant
            </Link>
          </Button>
        </div>
      )}

      <Pagination
        currentPage={paginatedVariants.page}
        totalPages={paginatedVariants.totalPages}
        hasNextPage={paginatedVariants.hasNextPage}
        hasPreviousPage={paginatedVariants.hasPreviousPage}
        onPageChange={handlePageChange}
      />

      <DeleteVariantModal variant={selectedVariant} open={deleteModalOpen} onOpenChange={setDeleteModalOpen} />
    </div>
  )
}
