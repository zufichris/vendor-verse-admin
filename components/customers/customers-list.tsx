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
import { TUser } from "@/lib/types/user"
import { UserAvatar } from "../user-avatar"
import Link from "next/link"

const getActiveStatusColor = () => "bg-green-500/10 text-green-500 hover:bg-green-500/20"
const getInactiveStatusColor = () => "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
const getStatusColor = (status: boolean) => status ? getActiveStatusColor() : getInactiveStatusColor()


interface CustomerListProps {
  readonly customers: TUser[],
}

export function CustomersList({ customers }: CustomerListProps) {
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
                <TableCell className="font-medium">
                  <Link href={`/customers/${customer.custId}`}>
                    #{customer.custId}</Link>
                </TableCell>
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

