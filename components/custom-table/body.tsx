'use client'

import { IResponseDataPaginated, ISearchData } from "@/lib/types/global"
import { useState } from "react"
import { Card} from "../ui/card"
import { ViewSwitcher } from "../ui/table-view-switch"
import { ArrowUpDown} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Table, TableHead, TableHeader } from "../ui/table"
import { useQueryString } from "@/hooks/use-query-string"
import { SearchBar } from "../search"

interface CustomTableBodyProps extends Pick<IResponseDataPaginated<unknown> & { success: true }, 'filterCount'> {
    readonly title: string,
    readonly headers: { title: string, classname?: string }[],
    readonly sortFields: string[],
    readonly GridBody: React.ReactNode,
    readonly TableBody: React.ReactNode,
    readonly search: {
        searchFunction: (searchString: string) => Promise<ISearchData[]>,
        placeholder?: string
        imageFallback?: React.ReactNode
    }
}

export function CustomTableBody({ title, search, headers, sortFields, GridBody, TableBody, filterCount }: CustomTableBodyProps) {
    const [view, setView] = useState<"table" | "grid">("grid")

    const { queryString, searchParams } = useQueryString()

    function handleSortField(field?: string) {
        queryString({
            sort_by: field
        })
    }
    function handleSortOrder(order: string) {
        queryString({
            sort_order: order
        })
    }
    return (
        <Card>
            <div className="p-4 space-y-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
                            <ViewSwitcher view={view} onViewChange={setView} />
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                            <SearchBar imageFallback={search.imageFallback}
                                placeholder={search.placeholder} fetcher={search.searchFunction} />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                        Sort by
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={searchParams.get("sort_by") ?? "name"} onValueChange={handleSortField}>
                                        {sortFields.map((field) => (
                                            <DropdownMenuRadioItem key={field} value={field.trim()}>{field}</DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={searchParams.get("sort_order") ?? "asc"} onValueChange={handleSortOrder}>
                                        <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {view === "table" ? (
                    <div className="relative w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                {headers.map(head => (
                                    <TableHead key={head.title} className={head.classname}>{head.title}</TableHead>
                                ))}
                            </TableHeader>
                            {TableBody}
                        </Table>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {GridBody}
                    </div>
                )}

                {filterCount === 0 && <div className="text-center py-12 text-muted-foreground">No customers found.</div>}
            </div>
        </Card>
    )
}




