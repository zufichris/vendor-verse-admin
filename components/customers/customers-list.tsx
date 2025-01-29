"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Mail, Phone, Edit, Trash, Search, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TUser } from "@/lib/types/user"
import { UserAvatar } from "../user-avatar"
import { ViewSwitcher } from "@/components/ui/table-view-switch"
import Link from "next/link"
import { useState } from "react"

type SortField = "name" | "email" | "orders" | "spent" | "status" | "lastOrder"
type SortOrder = "asc" | "desc"

const getActiveStatusColor = () => "bg-green-500/10 text-green-500 hover:bg-green-500/20"
const getInactiveStatusColor = () => "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
const getStatusColor = (status: boolean) => (status ? getActiveStatusColor() : getInactiveStatusColor())

interface CustomerListProps {
  readonly customers: TUser[]
}

export function CustomersList({ customers }: CustomerListProps) {
  const [view, setView] = useState<"table" | "grid">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  return (
    <Card>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Customers</h2>
              <ViewSwitcher view={view} onViewChange={setView} />
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Sort by
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                    <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="email">Email</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="orders">Orders</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="spent">Total Spent</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="lastOrder">Last Order</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                    <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {view === "table" ? (
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden sm:table-cell">Orders</TableHead>
                  <TableHead className="hidden sm:table-cell">Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Order</TableHead>
                  <TableHead className="w-[60px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.custId}>
                    <TableCell className="font-medium">
                      <Link href={`/customers/${customer.custId}`} className="hover:underline">
                        #{customer.custId}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2 min-w-[180px]">
                        <UserAvatar
                          size={"sm"}
                          src={customer?.profilePictureUrl?.url}
                          firstName={customer?.firstName!}
                          lastName={customer?.lastName!}
                        />
                        <div>
                          <div className="font-medium capitalize">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground md:hidden">{customer.email}</div>
                          <div className="text-sm text-muted-foreground sm:hidden flex items-center gap-2">
                            <span>Orders: {customer?.stats?.totalOrders ?? 0}</span>
                            <span>•</span>
                            <span>${customer?.stats?.totalSpent ?? 0}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phoneNumber ?? "N/A"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{customer?.stats?.totalOrders ?? 0}</TableCell>
                    <TableCell className="hidden sm:table-cell">${customer?.stats?.totalSpent ?? 0}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(customer.isActive)} whitespace-nowrap`} variant="secondary">
                        {customer.isActive ? "active" : "suspended"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {customer?.stats?.ordersHistory[0]?.orderId ?? "Never"}
                    </TableCell>
                    <TableCell className="text-right p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
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
        ) : (
          <div className="grid gap-4">
            {customers.map((customer) => (
              <Card key={customer.custId} className="p-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-4 w-full">
                    <UserAvatar
                      size={"md"}
                      src={customer?.profilePictureUrl?.url}
                      firstName={customer?.firstName!}
                      lastName={customer?.lastName!}
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <Link href={`/customers/${customer.custId}`} className="font-medium hover:underline truncate">
                          {customer.firstName} {customer.lastName}
                        </Link>
                        <Badge
                          className={`${getStatusColor(customer.isActive)} whitespace-nowrap w-fit`}
                          variant="secondary"
                        >
                          {customer.isActive ? "active" : "suspended"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        {customer.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span>{customer.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span>Orders: {customer?.stats?.totalOrders ?? 0}</span>
                        <span>Total Spent: ${customer?.stats?.totalSpent ?? 0}</span>
                        {customer?.stats?.ordersHistory[0]?.orderId && (
                          <span className="truncate">Last Order: #{customer?.stats?.ordersHistory[0]?.orderId}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
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
                </div>
              </Card>
            ))}
          </div>
        )}

        {customers.length === 0 && <div className="text-center py-12 text-muted-foreground">No customers found.</div>}
      </div>
    </Card>
  )
}

