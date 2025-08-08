import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  ShoppingBag,
  Users,
  PackageIcon,
} from "lucide-react";
interface SalesOverviewProps {
  dateRange: "daily" | "weekly" | "monthly";
}
// Mock data for different date ranges
const mockData = {
  daily: {
    revenue: {
      value: 12450,
      change: 12.5,
    },
    orders: {
      value: 356,
      change: 8.2,
    },
    customers: {
      value: 245,
      change: -3.1,
    },
    products: {
      value: 48,
      change: 4.7,
    },
  },
  weekly: {
    revenue: {
      value: 84320,
      change: 15.8,
    },
    orders: {
      value: 2134,
      change: 10.5,
    },
    customers: {
      value: 1245,
      change: 5.3,
    },
    products: {
      value: 156,
      change: 2.1,
    },
  },
  monthly: {
    revenue: {
      value: 324560,
      change: 8.4,
    },
    orders: {
      value: 8432,
      change: 6.7,
    },
    customers: {
      value: 4521,
      change: 12.3,
    },
    products: {
      value: 532,
      change: -1.2,
    },
  },
};
const SalesOverview: React.FC<SalesOverviewProps> = ({ dateRange }) => {
  const data = mockData[dateRange];
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Total Revenue
          </CardTitle>
          <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">
            {formatCurrency(data.revenue.value)}
          </div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            {data.revenue.change > 0 ? (
              <ArrowUpIcon className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
            )}
            <span
              className={
                data.revenue.change > 0 ? "text-green-500" : "text-red-500"
              }
            >
              {Math.abs(data.revenue.change)}%
            </span>
            <span className="ml-1 hidden sm:inline">from previous period</span>
            <span className="ml-1 sm:hidden">prev</span>
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Orders
          </CardTitle>
          <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">
            {formatNumber(data.orders.value)}
          </div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            {data.orders.change > 0 ? (
              <ArrowUpIcon className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
            )}
            <span
              className={
                data.orders.change > 0 ? "text-green-500" : "text-red-500"
              }
            >
              {Math.abs(data.orders.change)}%
            </span>
            <span className="ml-1 hidden sm:inline">from previous period</span>
            <span className="ml-1 sm:hidden">prev</span>
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Customers
          </CardTitle>
          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">
            {formatNumber(data.customers.value)}
          </div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            {data.customers.change > 0 ? (
              <ArrowUpIcon className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
            )}
            <span
              className={
                data.customers.change > 0 ? "text-green-500" : "text-red-500"
              }
            >
              {Math.abs(data.customers.change)}%
            </span>
            <span className="ml-1 hidden sm:inline">from previous period</span>
            <span className="ml-1 sm:hidden">prev</span>
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Active Products
          </CardTitle>
          <PackageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">
            {formatNumber(data.products.value)}
          </div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            {data.products.change > 0 ? (
              <ArrowUpIcon className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
            )}
            <span
              className={
                data.products.change > 0 ? "text-green-500" : "text-red-500"
              }
            >
              {Math.abs(data.products.change)}%
            </span>
            <span className="ml-1 hidden sm:inline">from previous period</span>
            <span className="ml-1 sm:hidden">prev</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
export { SalesOverview };
