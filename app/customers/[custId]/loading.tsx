import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function CustomerDetailsLoading() {
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="mt-2 h-4 w-[300px]" />
                </div>
                <Skeleton className="h-10 w-[140px]" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-6 w-[140px]" />
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className="h-4 w-[200px]" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-[200px]" />
                                <div className="flex space-x-2">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                                <Skeleton className="h-4 w-[150px]" />
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-4 w-4" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-[100px]" />
                                        <Skeleton className="h-4 w-[150px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Stats Card Loading State */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-6 w-[160px]" />
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className="h-4 w-[240px]" />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-6 w-[120px]" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <div className="mb-4">
                    <Skeleton className="h-10 w-[300px]" />
                </div>

                <div className="space-y-4">
                    {/* Additional Details Loading State */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-6 w-[180px]" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start space-x-4">
                                <Skeleton className="h-4 w-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes Loading State */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-6 w-[100px]" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[80%]" />
                                <Skeleton className="h-4 w-[60%]" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Billing Loading State */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-6 w-[160px]" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-4 w-4" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-[120px]" />
                                        <Skeleton className="h-4 w-[180px]" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

