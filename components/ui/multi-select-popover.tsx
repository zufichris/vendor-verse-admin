"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export interface MultiSelectOption {
  id: string
  label: string
  value: string
}

interface MultiSelectPopoverProps {
  options: MultiSelectOption[]
  selected: string[]
  onSelect: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  maxItems?: number
  disabled?: boolean
}

export function MultiSelectPopover({
  options,
  selected,
  onSelect,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  maxItems,
  disabled = false,
}: MultiSelectPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const selectedLabels = options.filter((option) => selected.includes(option.value)).map((option) => option.label)

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onSelect(selected.filter((item) => item !== value))
    } else {
      if (maxItems && selected.length >= maxItems) {
        return
      }
      onSelect([...selected, value])
    }
  }

  const handleRemove = (value: string) => {
    onSelect(selected.filter((item) => item !== value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
          disabled={disabled}
        >
          <div className="flex flex-1 items-center gap-1 overflow-hidden">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap items-center gap-1">
                {selectedLabels.map((label, index) => (
                  <div
                    key={index}
                    className="bg-accent/10 text-accent-foreground inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium"
                  >
                    {label}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(selected[index])
                      }}
                      className="hover:text-accent-foreground/80 ml-1 inline-flex items-center"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={searchValue} onValueChange={setSearchValue} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  disabled={Boolean(maxItems && !selected.includes(option.value) && selected.length >= maxItems)}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
