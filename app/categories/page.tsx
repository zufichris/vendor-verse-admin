import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories } from "@/lib/actions/category.actions";
import type { PaginationParams } from "@/types/pagination.types";
import { CategoriesTableSkeleton } from "@/components/categories/categories-table-skeleton";
import { CategoriesTable } from "@/components/categories/categories-table";

interface CategoriesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams;
  const paginationParams: PaginationParams = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    search: typeof params.search === "string" ? params.search : "",
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Categories
          </h2>
          <p className="text-muted-foreground">
            Organize your products with categories and subcategories
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            Create and manage product categories to help customers navigate your
            store effectively.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<CategoriesTableSkeleton />}>
            <CategoriesTableWrapper params={paginationParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function CategoriesTableWrapper({
  params,
}: {
  params: PaginationParams;
}) {
  const result = await getCategories(params);
  if (!result.success) {
    return (
      <div className="text-destructive w-full text-center">
        Failed To Load Categories
      </div>
    );
  }

  
  return <CategoriesTable categories={result.data} />;
}
