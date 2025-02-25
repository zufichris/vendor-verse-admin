import { ProductsList } from "@/components/products/products-list"
import { ProductsHeader } from "@/components/products/products-header"

export default async function ProductsPage() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return (
    <div className="flex flex-col gap-6 w-full pt-0">
      <ProductsHeader />
      <ProductsList />
    </div>
  )
}

