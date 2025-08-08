import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Users, UserPlus, UserCheck, UserX, Percent } from 'lucide-react'
interface CustomerStatsProps {
    dateRange: 'daily' | 'weekly' | 'monthly'
}
// Mock customer data for different date ranges
const mockData = {
    daily: {
        segments: [
            {
                name: 'New Customers',
                value: 24,
                change: 5.2,
            },
            {
                name: 'Returning',
                value: 67,
                change: 2.8,
            },
            {
                name: 'Inactive',
                value: 9,
                change: -1.5,
            },
        ],
        channels: [
            {
                name: 'Direct',
                value: 35,
            },
            {
                name: 'Organic Search',
                value: 25,
            },
            {
                name: 'Social Media',
                value: 20,
            },
            {
                name: 'Referral',
                value: 15,
            },
            {
                name: 'Email',
                value: 5,
            },
        ],
        retention: 76,
        churn: 3.2,
        lifetime: 245,
    },
    weekly: {
        segments: [
            {
                name: 'New Customers',
                value: 145,
                change: 8.7,
            },
            {
                name: 'Returning',
                value: 432,
                change: 4.2,
            },
            {
                name: 'Inactive',
                value: 67,
                change: -2.1,
            },
        ],
        channels: [
            {
                name: 'Direct',
                value: 32,
            },
            {
                name: 'Organic Search',
                value: 28,
            },
            {
                name: 'Social Media',
                value: 22,
            },
            {
                name: 'Referral',
                value: 12,
            },
            {
                name: 'Email',
                value: 6,
            },
        ],
        retention: 82,
        churn: 2.7,
        lifetime: 320,
    },
    monthly: {
        segments: [
            {
                name: 'New Customers',
                value: 543,
                change: 12.3,
            },
            {
                name: 'Returning',
                value: 1876,
                change: 7.6,
            },
            {
                name: 'Inactive',
                value: 321,
                change: -5.2,
            },
        ],
        channels: [
            {
                name: 'Direct',
                value: 30,
            },
            {
                name: 'Organic Search',
                value: 30,
            },
            {
                name: 'Social Media',
                value: 25,
            },
            {
                name: 'Referral',
                value: 10,
            },
            {
                name: 'Email',
                value: 5,
            },
        ],
        retention: 85,
        churn: 2.1,
        lifetime: 450,
    },
}
const CustomerStats: React.FC<CustomerStatsProps> = ({ dateRange }) => {
    const data = mockData[dateRange]
    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value)
    }
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(value)
    }
    return (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-medium">Customer Segments</h3>
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
                    {data.segments.map((segment, index) => (
                        <Card key={index}>
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex flex-row xs:flex-col items-center xs:text-center">
                                    {index === 0 ? (
                                        <UserPlus className="mb-0 mr-2 xs:mb-2 xs:mr-0 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                                    ) : index === 1 ? (
                                        <UserCheck className="mb-0 mr-2 xs:mb-2 xs:mr-0 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                    ) : (
                                        <UserX className="mb-0 mr-2 xs:mb-2 xs:mr-0 h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                                    )}
                                    <div className="text-xs sm:text-sm font-medium">
                                        {segment.name}
                                    </div>
                                    <div className="ml-auto xs:ml-0 xs:mt-1 text-base xs:text-xl sm:text-2xl font-bold">
                                        {formatNumber(segment.value)}
                                    </div>
                                    <div className="hidden xs:flex xs:mt-1 items-center text-[10px] sm:text-xs">
                                        <span
                                            className={
                                                segment.change > 0 ? 'text-green-500' : 'text-red-500'
                                            }
                                        >
                                            {segment.change > 0 ? '+' : ''}
                                            {segment.change}%
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Card>
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                <span className="text-xs sm:text-sm font-medium">
                                    Total Customers
                                </span>
                            </div>
                            <div className="text-base sm:text-xl font-bold">
                                {formatNumber(
                                    data.segments.reduce((sum, s) => sum + s.value, 0),
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-medium">
                    Acquisition Channels
                </h3>
                <div className="space-y-2">
                    {data.channels.map((channel, index) => (
                        <Card key={index}>
                            <CardContent className="p-2 sm:p-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs sm:text-sm font-medium">
                                        {channel.name}
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="flex items-center text-[10px] sm:text-xs"
                                    >
                                        <Percent className="mr-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                        {channel.value}%
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <Card>
                        <CardContent className="p-2 sm:p-3">
                            <div className="text-center">
                                <div className="text-[10px] sm:text-xs text-muted-foreground">
                                    Retention
                                </div>
                                <div className="text-sm sm:text-lg font-bold text-green-500">
                                    {data.retention}%
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-2 sm:p-3">
                            <div className="text-center">
                                <div className="text-[10px] sm:text-xs text-muted-foreground">
                                    Churn Rate
                                </div>
                                <div className="text-sm sm:text-lg font-bold text-red-500">
                                    {data.churn}%
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-2 sm:p-3">
                            <div className="text-center">
                                <div className="text-[10px] sm:text-xs text-muted-foreground">
                                    Lifetime Value
                                </div>
                                <div className="text-sm sm:text-lg font-bold">
                                    {formatCurrency(data.lifetime)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export { CustomerStats }
