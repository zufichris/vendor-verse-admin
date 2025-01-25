import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { AnalyticsCharts } from "@/components/analytics/analytics-charts"
import { AnalyticsStats } from "@/components/analytics/analytics-stats"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 w-full pt-0">
        <AnalyticsHeader />
        <AnalyticsStats />
        <AnalyticsCharts />
      </div>
  )
}

