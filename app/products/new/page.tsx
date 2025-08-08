import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateProductForm } from "@/components/products/create-product-form";
import { getProductCategories } from "@/lib/actions/product.actions";
import { Skeleton } from "@/components/ui/skeleton";

export default async function NewProductPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          Create New Product
        </h2>
        <p className="text-muted-foreground">
          Add a new product to your catalog with all the necessary details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new product. All fields marked
            with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<CreateProductFormSkeleton />}>
            <CreateProductFormWrapper />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function CreateProductFormWrapper() {
  const result = await getProductCategories();
  return (
    <CreateProductForm categories={result.success ? result.data.data : []} />
  );
}

function CreateProductFormSkeleton() {
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
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full" />
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
  );
}
