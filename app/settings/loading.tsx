import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { SettingsTabsSkeleton } from "@/components/settings/settings-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 w-full pt-0">
        <DashboardHeader />
        <div className="space-y-1">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <SettingsTabsSkeleton />
      </div>
    </DashboardShell>
  )
}

