'use client'

import { IResponseDataPaginated } from "@/lib/types/global"
import { useState } from "react"
import { Card } from "../ui/card"
import { ViewSwitcher } from "../ui/table-view-switch"
import { Input } from "../ui/input"
import { ArrowUpDown, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "../ui/button"
import { Table, TableHead, TableHeader } from "../ui/table"
import { useQueryString } from "@/hooks/use-query-string"

interface CustomTableBodyProps extends Pick<IResponseDataPaginated<unknown> & { success: true }, 'filterCount'> {
    readonly title: string,
    readonly headers: { title: string, classname?: string }[],
    readonly sortFields: string[],
    readonly GridBody: React.ReactNode,
    readonly TableBody: React.ReactNode
}
type SortOrder = "asc" | "desc"

export function CustomTableBody({ title, headers, sortFields, GridBody, TableBody, filterCount }: CustomTableBodyProps) {
    const [view, setView] = useState<"table" | "grid">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortField, setSortField] = useState<string>(sortFields[0])
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
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
                            <div className="relative flex-1 sm:flex-none sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search customers..."
                                    className="pl-8 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
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