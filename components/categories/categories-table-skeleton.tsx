import { Skeleton } from "../ui/skeleton";

export function CategoriesTableSkeleton() {
  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary animate-pulse">
            Categories
          </h2>
          <p className="text-muted-foreground animate-pulse">
            Organize your products with categories and subcategories
          </p>
        </div>
      </div>
      <div className="mt-6">
        {Array.from({ length: 5 })
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-24 my-2 p-4" />
          ))}
      </div>
    </div>
  );
}
