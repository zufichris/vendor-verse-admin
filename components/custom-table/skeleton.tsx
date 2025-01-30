import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="w-full space-y-4">
      {/* Header Section */}
      <div className="space-y-4 px-2 sm:px-4">
        {/* Add Button */}
        <div className="flex justify-end">
          <Skeleton className="h-9 w-[100px] sm:w-[140px]" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex items-baseline gap-2">
                      <Skeleton className="h-7 w-14" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="space-y-3 rounded-lg border p-3">
          {/* Top Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-7 w-7" />
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-9 w-full sm:w-[130px]" />
            <Skeleton className="h-4 w-full sm:w-[200px]" />
          </div>
        </div>
      </div>

      {/* Table/Grid Section */}
      <Card className="mx-2 sm:mx-4">
        <div className="space-y-4 p-3 sm:p-4">
          {/* Header Controls */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-16" />
              </div>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Skeleton className="h-9 w-full sm:w-64" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <div className="p-3">
                  <div className="flex flex-col gap-3">
                    {/* Top Section */}
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-14" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                        </div>
                      </div>
                      <Skeleton className="h-8 w-8" />
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

