import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { AnalyticsCharts } from "@/components/analytics/analytics-charts"
import { AnalyticsStats } from "@/components/analytics/analytics-stats"

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 w-full pt-0">
        <DashboardHeader />
        <AnalyticsHeader />
        <AnalyticsStats />
        <AnalyticsCharts />
      </div>
    </DashboardShell>
  )
}

