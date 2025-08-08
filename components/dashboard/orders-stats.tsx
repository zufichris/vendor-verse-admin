import React from "react";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent } from "../ui/card";

const orders = [
  {
    id: "ORD-5523",
    customer: "Alex Johnson",
    product: "Wireless Headphones",
    date: "2023-10-25",
    amount: 149.99,
    status: "Completed",
  },
  {
    id: "ORD-5522",
    customer: "Sarah Miller",
    product: "Smartphone Case",
    date: "2023-10-25",
    amount: 24.99,
    status: "Processing",
  },
  {
    id: "ORD-5521",
    customer: "Robert Davis",
    product: "Smart Watch",
    date: "2023-10-24",
    amount: 299.99,
    status: "Completed",
  },
  {
    id: "ORD-5520",
    customer: "Emily Wilson",
    product: "Bluetooth Speaker",
    date: "2023-10-24",
    amount: 79.99,
    status: "Shipped",
  },
  {
    id: "ORD-5519",
    customer: "Michael Brown",
    product: "Laptop Backpack",
    date: "2023-10-23",
    amount: 59.99,
    status: "Completed",
  },
];
const OrdersTable: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  const getStatusVariant = (status: string): "success" | "info" | "warning" => {
    switch (status) {
      case "Completed":
        return "success";
      case "Processing":
        return "info";
      case "Shipped":
        return "warning";
      default:
        return "info";
    }
  };
  // Mobile view card for each order
  const MobileOrderCard = ({ order }: { order: (typeof orders)[0] }) => (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex justify-between mb-2">
          <div className="font-medium">{order.id}</div>
          <Badge className={`bg-${getStatusVariant(order.status)}`}>
            {order.status}
          </Badge>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Customer:</span>
            <span>{order.customer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Product:</span>
            <span>{order.product}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{order.date}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-muted-foreground">Amount:</span>
            <span>{formatCurrency(order.amount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  return (
    <>
      {/* Mobile view */}
      <div className="md:hidden space-y-2">
        {orders.map((order) => (
          <MobileOrderCard key={order.id} order={order} />
        ))}
      </div>
      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {order.date}
                </TableCell>
                <TableCell>{formatCurrency(order.amount)}</TableCell>
                <TableCell>
                  <Badge className={`bg-${getStatusVariant(order.status)}`}>
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
export { OrdersTable };
