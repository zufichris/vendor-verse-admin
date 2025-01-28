"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Package, Settings, ShoppingCart, Store, Users, LayoutDashboard, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TUser } from "@/lib/types/user"
import { logout } from "@/lib/actions/auth"
import { UserAvatar } from "./user-avatar"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Vendors",
    href: "/vendors",
    icon: Store,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string,
  user: TUser
}

export function Sidebar({ className, user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div className={cn("border-r bg-background/60 backdrop-blur-xl w-[280px]", className)}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-lg">VendorVerse</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-4 h-[calc(100vh-8rem)]">
          <div className="space-y-2 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Overview</h2>
              <div className="space-y-1">
                {sidebarItems.slice(0, 1).map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Management</h2>
              <div className="space-y-1">
                {sidebarItems.slice(1, 5).map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant={pathname.includes(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">System</h2>
              <div className="space-y-1">
                {sidebarItems.slice(5).map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant={pathname.includes(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        {user ? <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10">
                <UserAvatar size={"sm"} src={user?.profilePictureUrl?.url!} firstName={user.firstName!} lastName={user.lastName!} />
              </div>
              <div className="space-y-1">
                <div><span className="capitalize">{user.firstName}</span> <span className="capitalize">{user.lastName}</span></div>
                <p className="text-xs text-muted-foreground capitalize">{user?.roles![0] ?? "User"}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  await logout()
                  router.push("/signin")
                }} className="text-red-600">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div> : null}
      </div>
    </div>
  )
}

