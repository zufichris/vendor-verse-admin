import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterColumn?: string
  placeholder?: string
}

export function DataTableToolbar<TData>({
  table,
  filterColumn = "name",
  placeholder = "Filter...",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={placeholder}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn(filterColumn)?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {table.getSelectedRowModel().rows.length > 0 && (
          <Button variant="destructive" size="sm" className="h-8">
            Delete Selected
          </Button>
        )}
      </div>
    </div>
  )
}

