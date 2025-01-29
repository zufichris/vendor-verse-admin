"use client"

import { Card } from "@/components/ui/card"
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
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { TUser } from "@/lib/types/user"
import { UserAvatar } from "../user-avatar"
import Link from "next/link"
import { CustomTableBody } from "../custom-table/body"

const sortFields = ["name", "email", "orders", "spent", "status", "lastOrder"]

const getActiveStatusColor = () => "bg-green-500/10 text-green-500 hover:bg-green-500/20"
const getInactiveStatusColor = () => "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
const getStatusColor = (status: boolean) => (status ? getActiveStatusColor() : getInactiveStatusColor())

interface CustomerListProps extends Record<'filterCount', number> {
  readonly customers: TUser[]
}
const headers = [
  {
    "title": "ID",
    "className": "w-[100px]"
  },
  {
    "title": "Customer",
    "className": ""
  },
  {
    "title": "Contact",
    "className": "hidden md:table-cell"
  },
  {
    "title": "Orders",
    "className": "hidden sm:table-cell"
  },
  {
    "title": "Total Spent",
    "className": "hidden sm:table-cell"
  },
  {
    "title": "Status",
    "className": ""
  },
  {
    "title": "Last Order",
    "className": "hidden lg:table-cell"
  },
  {
    "title": "Actions",
    "className": "w-[60px] text-right"
  }
]


export function CustomersList({ customers, filterCount }: CustomerListProps) {
  return (
    <CustomTableBody
      GridBody={<GridView customers={customers} />}
      TableBody={<TableView customers={customers} />}
      headers={headers}
      filterCount={filterCount}
      sortFields={sortFields}
      title="Customers" />
  )
}

interface BodyProps {
  readonly customers: TUser[]
}

function TableView({ customers }: BodyProps) {
  return <TableBody>
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
}
function GridView({ customers }: BodyProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2">
      {customers.map((customer) => (
        <Card key={customer.custId} className="p-4 relative">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3 w-full">
              <UserAvatar
                size={"md"}
                src={customer?.profilePictureUrl?.url}
                firstName={customer?.firstName!}
                lastName={customer?.lastName!}
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
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
              <DropdownMenuTrigger asChild className="absolute top-0 right-0 p-0.5">
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
  )
}
