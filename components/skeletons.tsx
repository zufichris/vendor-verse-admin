import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function OverviewSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-[120px]" />
            </CardTitle>
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-[120px] mb-1" />
            <Skeleton className="h-4 w-[140px]" />
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export function RecentOrdersSkeleton() {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>
            <Skeleton className="h-6 w-[150px]" />
          </CardTitle>
          <div className="mt-1">
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </div>
        <Skeleton className="h-10 w-[300px]" />
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
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-[100px] rounded-full" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    <Skeleton className="h-4 w-[100px] ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export function TopProductsSkeleton() {
  return (
    <Card className="transition-all hover:shadow-md w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            <Skeleton className="h-5 w-[150px]" />
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-[120px]" />
            <div className="flex gap-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-[100px] rounded-full" />
              ))}
            </div>
          </div>
        </div>
        <Skeleton className="h-9 w-[120px] rounded-md" />
      </CardHeader>
      <CardContent className="w-full px-0">
        <div className="h-[500px] w-full mt-4">
          <div className="h-full w-full bg-muted/10 rounded-lg animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export function VendorMetricsSkeleton() {
  return (
    <Card className="transition-all hover:shadow-md w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            <Skeleton className="h-5 w-[180px]" />
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-4 w-[120px]" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-[80px] rounded-full" />
              ))}
            </div>
          </div>
        </div>
        <Skeleton className="h-9 w-[120px] rounded-md" />
      </CardHeader>
      <CardContent className="w-full px-0">
        <div className="h-[400px] w-full">
          <div className="h-full w-full bg-muted/10 rounded-lg animate-pulse" />
        </div>
        <div className="mt-4 w-full px-4 sm:px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Orders</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-2 w-2 rounded-full" />
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[100px] ml-auto" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    <Skeleton className="h-4 w-[60px] ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Skeleton className="h-4 w-[40px]" />
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

