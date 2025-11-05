import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BannersTable } from "@/components/banners/banners-table"
import { BannersTableSkeleton } from "@/components/banners/banners-table-skeleton"
import { getBanners, getBannersAnalytics } from "@/lib/actions/banner.actions"
import type { PaginationParams } from "@/types/pagination.types"
import CreateBannerModal from "@/components/banners/create-banner-modal"

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

  const bannersAnalytics = await getBannersAnalytics()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Banners</h2>
          <p className="text-muted-foreground">Manage promotional banners and marketing content</p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateBannerModal  />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{bannersAnalytics?.total || 0}</div>
            <p className="text-xs text-muted-foreground">{(bannersAnalytics?.totalFromLastMont || 0) >= 0 ? '+' : '-'}{bannersAnalytics?.totalFromLastMont} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{bannersAnalytics?.active || 0}</div>
            <p className="text-xs text-muted-foreground">Currently displayed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{bannersAnalytics?.clickRate || 0}%</div>
            <p className="text-xs text-muted-foreground">{(bannersAnalytics?.clickRateFromLastWeek || 0) >= 0 ? '+' : '-'}{bannersAnalytics?.clickRateFromLastWeek}% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{(bannersAnalytics?.impressions||0)/1000}K</div>
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
