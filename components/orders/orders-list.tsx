"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Download, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { OrdersTableSkeleton } from "./orders-skeleton"
import { UpdateOrderStatusModal } from "./update-order-status-modal"

const orders = [
  {
    id: "ORD001",
    customer: "John Doe",
    email: "john.doe@example.com",
    vendor: "Tech Gadgets Inc",
    products: 3,
    amount: "$156.00",
    status: "Completed",
    date: "2024-01-19",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    vendor: "Fashion Hub",
    products: 2,
    amount: "$89.99",
    status: "Processing",
    date: "2024-01-19",
  },
  {
    id: "ORD003",
    customer: "Bob Wilson",
    email: "bob.wilson@example.com",
    vendor: "Home Essentials",
    products: 5,
    amount: "$245.50",
    status: "Pending",
    date: "2024-01-18",
  },
  {
    id: "ORD004",
    customer: "Alice Brown",
    email: "alice.brown@example.com",
    vendor: "Organic Foods",
    products: 1,
    amount: "$67.25",
    status: "Completed",
    date: "2024-01-18",
  },
  {
    id: "ORD005",
    customer: "Charlie Davis",
    email: "charlie.davis@example.com",
    vendor: "Sports Gear Pro",
    products: 4,
    amount: "$189.99",
    status: "Processing",
    date: "2024-01-17",
  },
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    case "processing":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
  }
}

export function OrdersList() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <OrdersTableSkeleton />
  }

  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Vendor</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.customer}</div>
                  <div className="text-sm text-muted-foreground">{order.email}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{order.vendor}</TableCell>
                <TableCell>{order.products}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(order.status)} whitespace-nowrap`} variant="secondary">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{order.date}</TableCell>
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
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UpdateOrderStatusModal />
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
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

