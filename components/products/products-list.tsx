"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductsTableSkeleton } from "./products-skeleton"

const products = [
  {
    id: "PROD001",
    name: "iPhone 14 Pro",
    category: "Electronics",
    price: "$999.00",
    stock: 145,
    status: "In Stock",
    vendor: "Tech Gadgets Inc",
  },
  {
    id: "PROD002",
    name: "MacBook Air M2",
    category: "Electronics",
    price: "$1,299.00",
    stock: 82,
    status: "Low Stock",
    vendor: "Tech Gadgets Inc",
  },
  {
    id: "PROD003",
    name: "AirPods Pro",
    category: "Electronics",
    price: "$249.00",
    stock: 0,
    status: "Out of Stock",
    vendor: "Tech Gadgets Inc",
  },
  {
    id: "PROD004",
    name: "Nike Air Max",
    category: "Fashion",
    price: "$179.00",
    stock: 234,
    status: "In Stock",
    vendor: "Fashion Hub",
  },
  {
    id: "PROD005",
    name: "Samsung S23",
    category: "Electronics",
    price: "$999.00",
    stock: 56,
    status: "Low Stock",
    vendor: "Tech Gadgets Inc",
  },
]

const getStockStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "in stock":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    case "low stock":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    case "out of stock":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
  }
}

export function ProductsList() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <ProductsTableSkeleton />
  }

  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Vendor</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Badge className={`${getStockStatusColor(product.status)} whitespace-nowrap`} variant="secondary">
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{product.vendor}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
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
    </Card>
  )
}

