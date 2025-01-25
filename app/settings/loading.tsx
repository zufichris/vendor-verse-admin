import { SettingsTabsSkeleton } from "@/components/settings/settings-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6 w-full pt-0">
      <div className="space-y-1">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <SettingsTabsSkeleton />
    </div>
  )
}

