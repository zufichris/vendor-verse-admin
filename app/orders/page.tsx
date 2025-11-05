import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, DollarSign, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { getOrders, getOrderAnalytics } from "@/lib/actions/order.actions";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrdersTableSkeleton } from "@/components/orders/orders-table-skeleton";
import type { OrderFilters } from "@/types/order.types";

interface OrdersPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
        paymentStatus?: string;
        paymentMethod?: string;
        dateFrom?: string;
        dateTo?: string;
        minAmount?: string;
        maxAmount?: string;
    }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const params = await searchParams;
    const page = Number.parseInt(params.page || "1");

    const filters: OrderFilters = {
        search: params.search,
        status: params.status as any,
        paymentStatus: params.paymentStatus as any,
        paymentMethod: params.paymentMethod as any,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        minAmount: params.minAmount
            ? Number.parseFloat(params.minAmount)
            : undefined,
        maxAmount: params.maxAmount
            ? Number.parseFloat(params.maxAmount)
            : undefined,
    };

    const [ordersResult, analytics] = await Promise.all([
        getOrders(page, 10, filters),
        getOrderAnalytics(),
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">
                        Manage and track customer orders
                    </p>
                </div>
                <Button asChild>
                    <Link href="/orders/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Order
                    </Link>
                </Button>
            </div>

            {/* Analytics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalOrders.total}</div>
                        <p className="text-xs text-muted-foreground">
                            +{analytics.totalOrders.today} today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${analytics.totalRevenue.total.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +{analytics.totalRevenue.thisWeek.toFixed(2)} this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average Order Value
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${analytics.averageOrder.pastThreeMonths.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +{analytics.averageOrder.thisMonth.toFixed(2)} this month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Orders
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.pendingOrders.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {analytics.pendingOrders.processing} processing
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<OrdersTableSkeleton />}>
                        <OrdersTable
                            pagination={ordersResult}
                            filters={filters}
                        />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
