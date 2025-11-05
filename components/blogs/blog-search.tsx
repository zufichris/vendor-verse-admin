"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"

export function BlogSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (searchValue) {
        params.set("search", searchValue)
        params.set("page", "1") // Reset to first page on new search
      } else {
        params.delete("search")
        params.set("page", "1")
      }
      router.push(`?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, router, searchParams])

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search blogs..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
