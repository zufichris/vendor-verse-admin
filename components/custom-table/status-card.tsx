'use client'

import { Card, CardContent } from "../ui/card"

interface TableStatsCardProps {
    readonly title: string
    readonly value: number | string
    readonly description?: string
    readonly icon: React.ReactNode
    readonly trend?: {
        value: number
        label: string
        isPositive: boolean
    }
}


export const TableStatsCard = ({ title, value, description, icon, trend }: TableStatsCardProps) => {
    return (
        <Card>
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                            <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
                            {trend && (
                                <span className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                                    {trend.isPositive ? "+" : "-"}
                                    {trend.value}%
                                </span>
                            )}
                        </div>
                        {description && <p className="text-sm text-muted-foreground">{description}</p>}
                        {trend && <p className="text-xs text-muted-foreground mt-1">{trend.label}</p>}
                    </div>
                    <div className="rounded-full bg-primary/10 p-2 sm:p-3 text-primary">{icon}</div>
                </div>
            </CardContent>
        </Card>
    )
}