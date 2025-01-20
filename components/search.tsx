"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function SearchBar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="relative w-full sm:w-[300px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." onClick={() => setOpen(true)} className="pl-8 h-9 md:h-10 w-full" readOnly />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen} className="max-w-[90vw] sm:max-w-[400px]">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="max-h-[60vh] md:max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem className="py-2 md:py-3">View Orders</CommandItem>
            <CommandItem className="py-2 md:py-3">Add Product</CommandItem>
            <CommandItem className="py-2 md:py-3">Manage Vendors</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem className="py-2 md:py-3">Profile</CommandItem>
            <CommandItem className="py-2 md:py-3">Billing</CommandItem>
            <CommandItem className="py-2 md:py-3">Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

