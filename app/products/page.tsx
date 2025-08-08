import { Suspense } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsTable } from "@/components/products/products-table";
import { ProductsTableSkeleton } from "@/components/products/products-table-skeleton";
import { getProducts } from "@/lib/actions/product.actions";
import type { PaginationParams } from "@/types/pagination.types";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const paginationParams: PaginationParams = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    search: typeof params.search === "string" ? params.search : "",
    sortBy: typeof params.sortBy === "string" ? params.sortBy : "createdAt",
    sortOrder: params.sortOrder === "asc" ? "asc" : "desc",
    filters: {
      status: typeof params.status === "string" ? params.status : "all",
      categoryId:
        typeof params.categoryId === "string" ? params.categoryId : undefined,
    },
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Products
          </h2>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            A list of all products in your store including their status, stock
            levels, and performance metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ProductsTableSkeleton />}>
            <ProductsTableWrapper params={paginationParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function ProductsTableWrapper({ params }: { params: PaginationParams }) {
  const result = await getProducts(params);
  if (!result.success) {
    return (
      <div className="text-red-500">
        Error loading products: {result.message}
      </div>
    );
  }

  return <ProductsTable paginatedProducts={result.data} />;
}
