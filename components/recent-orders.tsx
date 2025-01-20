import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/search"

const orders = [
  {
    id: "ORD001",
    customer: "John Doe",
    vendor: "Tech Gadgets Inc",
    amount: "$156.00",
    status: "Completed",
    date: "2024-01-19",
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    vendor: "Fashion Hub",
    amount: "$89.99",
    status: "Processing",
    date: "2024-01-19",
  },
  {
    id: "ORD003",
    customer: "Bob Wilson",
    vendor: "Home Essentials",
    amount: "$245.50",
    status: "Pending",
    date: "2024-01-18",
  },
  {
    id: "ORD004",
    customer: "Alice Brown",
    vendor: "Organic Foods",
    amount: "$67.25",
    status: "Completed",
    date: "2024-01-18",
  },
  {
    id: "ORD005",
    customer: "Charlie Davis",
    vendor: "Sports Gear Pro",
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

export function RecentOrders() {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Showing latest {orders.length} orders</p>
        </div>
        <SearchBar />
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.vendor}</TableCell>
                  <TableCell className="font-semibold">{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(order.status)} whitespace-nowrap px-2 py-1 text-xs sm:px-4 sm:py-1 sm:text-sm`}
                      variant="secondary"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right">{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

