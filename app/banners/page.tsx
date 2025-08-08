import { Suspense } from "react"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BannersTable } from "@/components/banners/banners-table"
import { BannersTableSkeleton } from "@/components/banners/banners-table-skeleton"
import { getBanners } from "@/lib/actions/banner.actions"
import type { PaginationParams } from "@/types/pagination.types"

interface BannersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BannersPage({ searchParams }: BannersPageProps) {
  const params = await searchParams
  const paginationParams: PaginationParams = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    search: typeof params.search === "string" ? params.search : "",
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Banners</h2>
          <p className="text-muted-foreground">Manage promotional banners and marketing content</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/banners/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">8</div>
            <p className="text-xs text-muted-foreground">Currently displayed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">3.2%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">45.2K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banner Management</CardTitle>
          <CardDescription>
            Create and manage promotional banners for your website homepage and category pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<BannersTableSkeleton />}>
            <BannersTableWrapper params={paginationParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

async function BannersTableWrapper({ params }: { params: PaginationParams }) {
  const paginatedBanners = await getBanners(params)
  return <BannersTable paginatedBanners={paginatedBanners} />
}
