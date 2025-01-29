'use client'

import { useQueryString } from "@/hooks/use-query-string"
import { IResponseDataPaginated } from "@/lib/types/global"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "../ui/button"

interface CustomTableHeaderProps {
    readonly pagination: Pick<IResponseDataPaginated<unknown> & { success: true },
        "filterCount" |
        "hasNextPage" |
        "hasPreviousPage" |
        "limit" |
        "page" |
        "totalPages" |
        "nextPage" |
        "previousPage"
    >
    readonly StatusCards?: React.ReactNode,
    readonly Filters?: React.ReactNode,
    readonly ActionButtons?: React.ReactNode
}


const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

export function CustomTableHeader({
    pagination,
    StatusCards,
    Filters,
    ActionButtons
}: CustomTableHeaderProps) {
    const { filterCount, hasNextPage, hasPreviousPage, limit, page, totalPages, nextPage, previousPage } = pagination

    const { queryString } = useQueryString()

    const startRange = (page - 1) * limit + 1
    const endRange = Math.min(page * limit, filterCount)

    const handlePageChange = (page?: number) => {
        if (!page) return
        queryString({ page: page })
    }

    const handleLimitChange = (limit: string) => {
        queryString({ limit: Number(limit), page: undefined })
    }

    return (
        <div className="space-y-4 p-4">
            <div className="flex justify-center sm:justify-end">
                {ActionButtons}
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {StatusCards}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {Filters}
                    <div className="hidden sm:block h-4 w-px bg-border" />
                    <Select value={limit.toString()} onValueChange={handleLimitChange}>
                        <SelectTrigger className="w-full sm:w-[130px]">
                            <SelectValue placeholder="Select limit" />
                        </SelectTrigger>
                        <SelectContent>
                            {ITEMS_PER_PAGE_OPTIONS.map((limit) => (
                                <SelectItem key={limit} value={limit.toString()}>
                                    {limit} per page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="hidden sm:block h-4 w-px bg-border" />
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                        Showing <span className="font-medium">{startRange}</span> to <span className="font-medium">{endRange}</span>{" "}
                        of <span className="font-medium">{filterCount}</span> results
                    </p>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePageChange(previousPage)}
                        disabled={!hasPreviousPage}
                        className="h-8 w-8"
                    >
                        ←
                    </Button>

                    {page > 2 && (
                        <>
                            <Button variant="ghost" size="icon" onClick={() => handlePageChange(1)} className="h-8 w-8">
                                1
                            </Button>
                            {page > 3 && <span className="px-1">...</span>}
                        </>
                    )}

                    {page > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => handlePageChange(page - 1)} className="h-8 w-8">
                            {page - 1}
                        </Button>
                    )}

                    <Button variant="default" size="icon" className="h-8 w-8">
                        {page}
                    </Button>

                    {page < totalPages && (
                        <Button variant="ghost" size="icon" onClick={() => handlePageChange(page + 1)} className="h-8 w-8">
                            {page + 1}
                        </Button>
                    )}

                    {page < totalPages - 1 && (
                        <>
                            {page < totalPages - 2 && <span className="px-1">...</span>}
                            <Button variant="ghost" size="icon" onClick={() => handlePageChange(totalPages)} className="h-8 w-8">
                                {totalPages}
                            </Button>
                        </>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePageChange(nextPage)}
                        disabled={!hasNextPage}
                        className="h-8 w-8"
                    >
                        →
                    </Button>
                </div>
            </div>
        </div>
    )
}