import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User, Settings, LogOut, ChevronDown, Clock, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"

export function DashboardHeader() {
  // Get current time and date
  const now = new Date()
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="sticky top-0 z-50 border-none shadow-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between rounded-lg p-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{timeString}</span>
            <span className="text-muted-foreground/60">•</span>
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">{dateString}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Welcome back, John!</h1>
            <p className="text-lg text-muted-foreground mt-1">Here's what's happening with your store today</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-10 w-10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
                <span className="sr-only">View notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  Mark all as read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                  <div className="flex items-center gap-2 font-medium">
                    New Order Received
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">New</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Order #1234 from John Doe</span>
                  <span className="text-xs text-muted-foreground">2 minutes ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                  <div className="font-medium">Low Stock Alert</div>
                  <span className="text-sm text-muted-foreground">Product "Smartphone X" is running low</span>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 w-fit gap-2 px-3">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="Profile"
                  className="rounded-full"
                  width={32}
                  height={32}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium hidden md:inline-block">John Doe</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="flex flex-col space-y-1">
                <span>John Doe</span>
                <span className="text-xs font-normal text-muted-foreground">john.doe@example.com</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 py-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
                <span className="ml-auto text-xs text-muted-foreground">⌘P</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 py-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
                <span className="ml-auto text-xs text-muted-foreground">⌘S</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 py-2 text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
                <span className="ml-auto text-xs text-muted-foreground">⌘Q</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}

