"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:block" />

      <div className="flex-1 w-full">
        {/* Mobile Header with Menu */}
        <div className="sticky top-0 z-50 lg:hidden w-full">
          <div className="flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <ScrollArea className="h-full">
                  <Sidebar className="border-0" />
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <span className="font-semibold">VendorVerse</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="h-[calc(100vh-4rem)] lg:h-screen w-full">
          <main className="flex-1 p-4 md:p-8 lg:p-10 w-full">{children}</main>
        </ScrollArea>
      </div>
    </div>
  )
}

