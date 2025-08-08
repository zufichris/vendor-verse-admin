import { Suspense } from "react";
import { notFound } from "next/navigation";
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
import { EditProductForm } from "@/components/products/edit-product-form";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories } from "@/lib/actions/category.actions";

interface EditProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product.success) {
    return {
      title: "Edit Product",
      description: "Product not found",
    };
  }

  return {
    title: `Edit ${product.data.name} - Admin`,
    description: `Edit details for ${product.data.name}`,
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { slug } = await params;

  return (
    <div className="flex-1 space-y-4  pt-6">
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
          Edit Product
        </h2>
        <p className="text-muted-foreground">
          Update product information and settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Update the product details below. All fields marked with * are
            required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EditProductFormSkeleton />}>
            <EditProductFormWrapper slug={slug} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function EditProductFormWrapper({ slug }: { slug: string }) {
  const producresult = await getProductBySlug(slug);

  const [prodResult, catsResult] = await Promise.all([
    await getProductBySlug(slug),
    await getCategories(),
  ]);

  if (!prodResult.success) {
    notFound();
  }

  return (
    <EditProductForm
      product={prodResult.data}
      categories={catsResult.data?.data || [prodResult.data.category]}
    />
  );
}

function EditProductFormSkeleton() {
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
