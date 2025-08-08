"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { DownloadIcon, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { SalesOverview } from "./sales-overview";
import { RevenueChart } from "./revenue-stats";
import { ServerPerformance } from "./server-stats";
import { OrdersTable } from "./orders-stats";
import { TopProducts } from "./top-products";
import { CustomerStats } from "./customer-stats";

export function Dashboard() {
  const [dateRange, setDateRange] = useState<"daily" | "weekly" | "monthly">(
    "daily",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <h1 className="text-lg font-semibold sm:text-xl">Dashboard</h1>
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {/* Desktop controls */}
          <div className="ml-auto hidden md:flex items-center gap-4">
            <Tabs defaultValue={dateRange} className="h-9">
              <TabsList>
                <TabsTrigger
                  value="daily"
                  onClick={() => setDateRange("daily")}
                >
                  Daily
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  onClick={() => setDateRange("weekly")}
                >
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  onClick={() => setDateRange("monthly")}
                >
                  Monthly
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t p-4 md:hidden">
            <div className="mb-4">
              <Tabs defaultValue={dateRange} className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger
                    value="daily"
                    onClick={() => setDateRange("daily")}
                    className="flex-1"
                  >
                    Daily
                  </TabsTrigger>
                  <TabsTrigger
                    value="weekly"
                    onClick={() => setDateRange("weekly")}
                    className="flex-1"
                  >
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger
                    value="monthly"
                    onClick={() => setDateRange("monthly")}
                    className="flex-1"
                  >
                    Monthly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button className="w-full">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        )}
      </header>
      {/* Dashboard Content */}
      <main className="flex-1 p-4 sm:p-6">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <SalesOverview dateRange={dateRange} />
        </div>
        <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Revenue trends over time</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
              <RevenueChart dateRange={dateRange} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Server Performance</CardTitle>
              <CardDescription>Real-time server metrics</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
              <ServerPerformance />
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
              <OrdersTable />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best selling items</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
              <TopProducts />
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 sm:mt-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Customer Statistics</CardTitle>
              <CardDescription>
                Customer acquisition and retention
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
              <CustomerStats dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
