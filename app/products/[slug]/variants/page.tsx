import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VariantsTable } from "@/components/variants/variants-table"
import { VariantsTableSkeleton } from "@/components/variants/variants-table-skeleton"
import { getProduct } from "@/lib/actions/product.actions"
import { getProductVariants } from "@/lib/actions/variant.actions"
import type { PaginationParams } from "@/types/pagination.types"

interface ProductVariantsPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductVariantsPage({ params, searchParams }: ProductVariantsPageProps) {
  const { id } = await params
  const searchParamsData = await searchParams

  const paginationParams: PaginationParams = {
    page: Number(searchParamsData.page) || 1,
    limit: Number(searchParamsData.limit) || 10,
    search: typeof searchParamsData.search === "string" ? searchParamsData.search : "",
    sortBy: typeof searchParamsData.sortBy === "string" ? searchParamsData.sortBy : "createdAt",
    sortOrder: searchParamsData.sortOrder === "asc" ? "asc" : "desc",
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<ProductHeaderSkeleton />}>
        <ProductHeaderWrapper productId={id} />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<VariantStatsSkeleton />}>
          <VariantStatsWrapper productId={id} />
        </Suspense>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>
                Manage different variations of this product including pricing, stock, and attributes.
              </CardDescription>
            </div>
            <Button asChild>
              <Link href={`/products/${id}/variants/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Variant
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<VariantsTableSkeleton />}>
            <VariantsTableWrapper productId={id} params={paginationParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

async function ProductHeaderWrapper({ productId }: { productId: string }) {
  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Variants: {product.name}</h1>
        {product.featured && (
          <Badge variant="outline" className="text-primary">
            Featured
          </Badge>
        )}
        <Badge variant={product.type === "configurable" ? "default" : "secondary"}>{product.type}</Badge>
      </div>
      <p className="text-muted-foreground">
        SKU: {product.sku} • Category: {product.category.name}
      </p>
    </div>
  )
}

async function VariantStatsWrapper({ productId }: { productId: string }) {
  const variantsResult = await getProductVariants(productId, { limit: 100 }) // Get all variants for stats
  const variants = variantsResult.data

  const totalVariants = variants.length
  const inStockVariants = variants.filter((v) => v.isInStock).length
  const outOfStockVariants = variants.filter((v) => !v.isInStock).length
  const lowStockVariants = variants.filter((v) => v.isInStock && v.stockQuantity < 5).length
  const totalStock = variants.reduce((sum, v) => sum + v.stockQuantity, 0)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalVariants}</div>
          <p className="text-xs text-muted-foreground">Product variations</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{inStockVariants}</div>
          <p className="text-xs text-muted-foreground">Available variants</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{lowStockVariants}</div>
          <p className="text-xs text-muted-foreground">Below 5 units</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-info">{totalStock}</div>
          <p className="text-xs text-muted-foreground">Units across all variants</p>
        </CardContent>
      </Card>
    </>
  )
}

async function VariantsTableWrapper({ productId, params }: { productId: string; params: PaginationParams }) {
  const paginatedVariants = await getProductVariants(productId, params)
  return <VariantsTable productId={productId} paginatedVariants={paginatedVariants} />
}

function ProductHeaderSkeleton() {
  return (
    <div>
      <div className="flex items-center space-x-4 mb-2">
        <div className="h-9 w-64 bg-muted animate-pulse rounded" />
        <div className="h-6 w-20 bg-muted animate-pulse rounded" />
        <div className="h-6 w-24 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-4 w-96 bg-muted animate-pulse rounded" />
    </div>
  )
}

function VariantStatsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </>
  )
}
