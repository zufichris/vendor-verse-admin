import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateVariantForm } from "@/components/variants/create-variant-form"
import { getProduct } from "@/lib/actions/product.actions"
import { Skeleton } from "@/components/ui/skeleton"

interface NewVariantPageProps {
  params: Promise<{ id: string }>
}

export default async function NewVariantPage({ params }: NewVariantPageProps) {
  const { id } = await params

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/products/${id}/variants`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Variants
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ProductHeaderSkeleton />}>
        <ProductHeaderWrapper productId={id} />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Create New Variant</CardTitle>
          <CardDescription>
            Add a new variant to this product with specific attributes, pricing, and stock information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<CreateVariantFormSkeleton />}>
            <CreateVariantFormWrapper productId={id} />
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
      <h2 className="text-3xl font-bold tracking-tight text-primary">Add Variant: {product.name}</h2>
      <p className="text-muted-foreground">Create a new variation of this product</p>
    </div>
  )
}

async function CreateVariantFormWrapper({ productId }: { productId: string }) {
  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  return <CreateVariantForm product={product} />
}

function ProductHeaderSkeleton() {
  return (
    <div>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-4 w-48 mt-2" />
    </div>
  )
}

function CreateVariantFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
