import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import React from "react"

export default function CustomersTableSkeleton() {
  return (
    <React.Fragment>
      {/* ==========================HEADER LOADER============= */}
      <div className="space-y-4 p-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-[140px]" />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-baseline gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-11 w-11 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-9 rounded-full" />
              </div>
              <div className="h-4 w-px bg-border" />
              <Skeleton className="h-9 w-[130px]" />
              <div className="h-4 w-px bg-border" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* =====================TABLE LOADER=================== */}
      <Card>
        <div className="p-4 space-y-4">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-32" /> {/* Title */}
              <Skeleton className="h-8 w-20" /> {/* View switcher */}
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-64" /> {/* Search input */}
              <Skeleton className="h-10 w-24" /> {/* Sort button */}
            </div>
          </div>

          {/* Grid Cards Skeleton */}
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" /> {/* Avatar */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-32" /> {/* Name */}
                        <Skeleton className="h-5 w-16" /> {/* Status badge */}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3" /> {/* Mail icon */}
                          <Skeleton className="h-4 w-40" /> {/* Email */}
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3" /> {/* Phone icon */}
                          <Skeleton className="h-4 w-32" /> {/* Phone */}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-24" /> {/* Orders */}
                        <Skeleton className="h-4 w-32" /> {/* Total Spent */}
                        <Skeleton className="h-4 w-36" /> {/* Last Order */}
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8" /> {/* Action menu */}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </React.Fragment>
  )
}

