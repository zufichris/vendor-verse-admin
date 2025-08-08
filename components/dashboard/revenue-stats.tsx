import React from "react";
import { Card, CardContent } from "../ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
interface RevenueChartProps {
  dateRange: "daily" | "weekly" | "monthly";
}
// Mock data for different date ranges
const generateMockData = (range: "daily" | "weekly" | "monthly") => {
  if (range === "daily") {
    return {
      currentRevenue: 12500,
      previousRevenue: 10800,
      percentChange: 15.7,
      highestRevenue: 1450,
      highestHour: "14:00",
      averageRevenue: 520,
      totalOrders: 245,
    };
  } else if (range === "weekly") {
    return {
      currentRevenue: 87500,
      previousRevenue: 76200,
      percentChange: 14.8,
      highestRevenue: 18450,
      highestDay: "Friday",
      averageRevenue: 12500,
      totalOrders: 1245,
    };
  } else {
    return {
      currentRevenue: 345000,
      previousRevenue: 320000,
      percentChange: 7.8,
      highestRevenue: 14800,
      highestDay: "15th",
      averageRevenue: 11500,
      totalOrders: 4850,
    };
  }
};
const RevenueChart: React.FC<RevenueChartProps> = ({ dateRange }) => {
  const data = generateMockData(dateRange);
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
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            Current Revenue
          </div>
          <div className="text-xl sm:text-2xl font-bold">
            {formatCurrency(data.currentRevenue)}
          </div>
        </div>
        <div className="flex items-center rounded-full bg-primary/10 px-2 py-1 sm:px-3">
          {data.percentChange > 0 ? (
            <ArrowUpIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
          )}
          <span
            className={
              data.percentChange > 0 ? "text-green-500" : "text-red-500"
            }
          >
            {data.percentChange.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              {dateRange === "daily" ? "Highest Hour" : "Highest Day"}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-base sm:text-lg font-semibold">
                {dateRange === "daily" ? data.highestHour : data.highestDay}
              </div>
              <div className="text-xs sm:text-sm font-medium">
                {formatCurrency(data.highestRevenue)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Average Revenue
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-base sm:text-lg font-semibold">
                {dateRange === "daily"
                  ? "Per Hour"
                  : dateRange === "weekly"
                    ? "Per Day"
                    : "Per Day"}
              </div>
              <div className="text-xs sm:text-sm font-medium">
                {formatCurrency(data.averageRevenue)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Previous Period
            </div>
            <div className="mt-1 text-base sm:text-lg font-semibold">
              {formatCurrency(data.previousRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Orders
            </div>
            <div className="mt-1 text-base sm:text-lg font-semibold">
              {formatNumber(data.totalOrders)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export { RevenueChart };
