"use client"

import { useSearch } from "@/hooks/use-search"
import type { ISearchData } from "@/lib/types/global"
import { Loader2, Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./ui/command"
import { Image } from "./ui/image"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchBarProps {
  readonly fetcher: (searchText: string) => Promise<ISearchData[]>
  readonly placeholder?: string,
  readonly imageFallback?: React.ReactNode
}

export function SearchBar({ fetcher, imageFallback, placeholder = "Search ..." }: SearchBarProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const commandRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { searchText, setSearchText, getData, data, isLoading } = useSearch(fetcher)
  const debouncedSearchText = useDebounce(searchText, 300)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getData()
        setError(null)
      } catch (err) {
        setError("Failed to fetch search results")
      }
    }

    if (debouncedSearchText) {
      fetchData()
    }
  }, [debouncedSearchText, getData])
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        inputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (searchText) {
      setIsOpen(true)
    }
  }, [searchText])

  const handleSelect = (item: ISearchData) => {
    setIsOpen(false)
    setSearchText("")
    router.push(item.link ?? "")
  }

  const handleClear = () => {
    setSearchText("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="relative flex-1 sm:flex-none sm:w-64" ref={commandRef} role="search" aria-label="Site search">
      <div className="relative">
        <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Search className="h-4 w-4" aria-hidden="true" />
          )}
        </div>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          className={cn(
            "pl-8 pr-10 transition-colors",
            isLoading && "pr-12",
            error && "border-red-500 focus-visible:ring-red-500",
          )}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-describedby={error ? "search-error" : undefined}
          aria-busy={isLoading}
        />
        {searchText && !isLoading && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1.5 h-6 w-6 rounded-full hover:bg-muted transition-colors"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </Button>
        )}
      </div>

      {error && (
        <p id="search-error" className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}

      {isOpen && searchText && (
        <Command
          className={cn(
            "absolute top-full min-h-[270px] z-50 w-full mt-2 rounded-lg border shadow-md bg-popover",
            "transition-all duration-200 origin-top",
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95",
          )}
          id="search-results"
        >
          <CommandList className="max-h-[300px] overflow-y-auto scrollbar-thin">
            <CommandEmpty className="py-6 text-center text-sm">
              {isLoading ? "Searching..." : "No results found"}
            </CommandEmpty>
            {data?.length > 0 && (
              <CommandGroup heading="Search Results">
                {data.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors"
                  >
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        src={item.src!}
                        alt={item.title}
                        fill
                        className="aspect-square object-cover rounded-md"
                        fallback={imageFallback}
                      />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium truncate">{item.title}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      )}

      <div className="hidden sm:block absolute right-2 top-2 text-xs text-muted-foreground">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  )
}

