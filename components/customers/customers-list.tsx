"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Mail, Phone, Edit, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CustomersTableSkeleton } from "./customers-skeleton"
import { TUser } from "@/lib/types/user"
import { getCustomers } from "@/lib/actions/user"
import { UserAvatar } from "../user-avatar"

// const customers = [
//   {
//     id: "CUST001",
//     name: "John Doe",
//     email: "john.doe@example.com",
//     phone: "+1 234 567 890",
//     orders: 12,
//     spent: "$1,234.56",
//     status: "Active",
//     lastOrder: "2024-01-19",
//   },
//   {
//     id: "CUST002",
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//     phone: "+1 234 567 891",
//     orders: 8,
//     spent: "$876.43",
//     status: "Active",
//     lastOrder: "2024-01-18",
//   },
//   {
//     id: "CUST003",
//     name: "Bob Wilson",
//     email: "bob.wilson@example.com",
//     phone: "+1 234 567 892",
//     orders: 0,
//     spent: "$0.00",
//     status: "Inactive",
//     lastOrder: "N/A",
//   },
//   {
//     id: "CUST004",
//     name: "Alice Brown",
//     email: "alice.brown@example.com",
//     phone: "+1 234 567 893",
//     orders: 5,
//     spent: "$543.21",
//     status: "Active",
//     lastOrder: "2024-01-15",
//   },
//   {
//     id: "CUST005",
//     name: "Charlie Davis",
//     email: "charlie.davis@example.com",
//     phone: "+1 234 567 894",
//     orders: 3,
//     spent: "$321.12",
//     status: "Active",
//     lastOrder: "2024-01-17",
//   },
// ]

const getStatusColor = (status: boolean) => {
  return status ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
}

export function CustomersList() {
  const [isLoading, setIsLoading] = useState(true)
  const [customers, setCustomers] = useState<TUser[]>([])
  const get = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await getCustomers()
      if (res?.success) {
        setCustomers(res.data)
      } else {
        throw new Error(res?.message! + res?.status!)
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])
  useEffect(() => {
    get()
  }, [get])

  if (isLoading) {
    return <CustomersTableSkeleton />
  }

  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Last Order</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.custId}>
                <TableCell className="font-medium">#{customer.custId}</TableCell>
                <TableCell >
                  <div className="font-medium capitalize flex items-center gap-1">
                  <UserAvatar src={customer?.profilePictureUrl?.url!} firstName={customer?.firstName!} lastName={customer?.lastName!} />
                    <span>{customer.firstName}</span>
                    <span>{customer.lastName}</span>
                  </div>
                  <div className="text-sm text-muted-foreground md:hidden">{customer.email}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {customer.phoneNumber ?? "N/A"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>orders</TableCell>
                <TableCell>spent</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(customer.isActive)} whitespace-nowrap`} variant="secondary">
                    {customer.isActive ? "active" : "suspended"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{"customer.lastOrder"}</TableCell>
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

