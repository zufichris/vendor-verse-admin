"use client"

import { BarChart3, LineChart, AreaChart } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface ChartToggleProps {
  value: string
  onValueChange: (value: string) => void
}

export function ChartToggle({ value, onValueChange }: ChartToggleProps) {
  return (
    <ToggleGroup type="single" value={value} onValueChange={onValueChange}>
      <ToggleGroupItem value="bar" aria-label="Show bar chart">
        <BarChart3 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="line" aria-label="Show line chart">
        <LineChart className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="area" aria-label="Show area chart">
        <AreaChart className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

