'use client'
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
import { logout } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { TUser } from "@/lib/types/user"
import { UserAvatar } from "./user-avatar"
interface DashboardHeaderProps {
  readonly user: TUser
}
export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
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
    <Card className="sticky top-0 z-50 border-none shadow-none bg-background/100 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-3">
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
            <h1 className="text-xl font-thin tracking-tight md:text-4xl">Welcome back, <span className="capitalize">{user.firstName}</span>!</h1>
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
                    New Order Received<span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">New</span>
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
            <DropdownMenuTrigger asChild className="py-1">
              <Button variant="outline" className="h-10 w-fit gap-2 px-3">
                <UserAvatar size={"sm"} src={user.profilePictureUrl?.url} firstName={user.firstName!} lastName={user.lastName!} />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium hidden md:inline-block">
                    <div className="capitalize"><span>{user.firstName}</span> <span>{user.lastName}</span></div>
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="flex flex-col space-y-1">
                <div className="capitalize"><span>{user.firstName}</span> <span>{user.lastName}</span></div>
                <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
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
              <DropdownMenuItem onClick={async () => {
                await logout()
                router.push("/signin")
              }} className="flex items-center gap-2 py-2 text-red-600">
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

