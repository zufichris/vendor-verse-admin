"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MoreHorizontal, Search, Filter, Eye, Edit, Trash2, UserCheck, UserX, Shield, Key } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { type User, UserStatus, UserRole } from "@/types/user.types"
import type { PaginationResult } from "@/types/pagination.types"
import { DeleteUserModal } from "./delete-user-modal"
import { toggleUserStatus } from "@/lib/actions/user.actions"
import { cn } from "@/lib/utils"

interface UsersTableProps {
    result: PaginationResult<User>
}

const statusColors = {
    [UserStatus.ACTIVE]: "bg-green-100 text-green-800",
    [UserStatus.INACTIVE]: "bg-gray-100 text-gray-800",
    [UserStatus.SUSPENDED]: "bg-yellow-100 text-yellow-800",
    [UserStatus.PENDING_VERIFICATION]: "bg-blue-100 text-blue-800",
    [UserStatus.BANNED]: "bg-red-100 text-red-800",
    [UserStatus.DELETED]: "bg-red-100 text-red-800",
}

const roleColors = {
    [UserRole.CUSTOMER]: "bg-blue-100 text-blue-800",
    [UserRole.ADMIN]: "bg-purple-100 text-purple-800",
    [UserRole.MODERATOR]: "bg-orange-100 text-orange-800",
    [UserRole.SUPPORT]: "bg-green-100 text-green-800",
    [UserRole.VENDOR]: "bg-yellow-100 text-yellow-800",
}

export function UsersTable({ result }: UsersTableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [status, setStatus] = useState(searchParams.get("status") || "")
    const [role, setRole] = useState(searchParams.get("role") || "")
    const [deleteUser, setDeleteUser] = useState<User | null>(null)

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value) {
            params.set("search", value)
        } else {
            params.delete("search")
        }
        params.delete("page")
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleStatusFilter = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== "all") {
            params.set("status", value)
        } else {
            params.delete("status")
        }
        params.delete("page")
        setStatus(value)
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleRoleFilter = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== "all") {
            params.set("role", value)
        } else {
            params.delete("role")
        }
        params.delete("page")
        setRole(value)
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleToggleStatus = async (user: User) => {
        const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE
        await toggleUserStatus(user.id, newStatus)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        A list of all users in your system including their name, email, role, and status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch(search)
                                    }
                                }}
                                className="pl-8"
                            />
                        </div>
                        <Select value={status} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                                <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                                <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                                <SelectItem value={UserStatus.PENDING_VERIFICATION}>Pending</SelectItem>
                                <SelectItem value={UserStatus.BANNED}>Banned</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={role} onValueChange={handleRoleFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value={UserRole.CUSTOMER}>Customer</SelectItem>
                                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                <SelectItem value={UserRole.MODERATOR}>Moderator</SelectItem>
                                <SelectItem value={UserRole.SUPPORT}>Support</SelectItem>
                                <SelectItem value={UserRole.VENDOR}>Vendor</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => handleSearch(search)}>
                            <Filter className="mr-2 h-4 w-4" />
                            Apply
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Verification</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead>Total Spent</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="w-[70px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="relative h-10 w-10">
                                                    <Image
                                                        src={user.profileImage || "/placeholder.svg?height=40&width=40"}
                                                        alt={`${user.firstName} ${user.lastName}`}
                                                        fill
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                    {user.phone && <div className="text-sm text-muted-foreground">{user.phone}</div>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn(roleColors[user.role], 'uppercase')}>{user.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={cn(statusColors[user.status], 'uppercase')}>{user.status.replace("_", " ")}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center space-x-1">
                                                    <div
                                                        className={`h-2 w-2 rounded-full ${user.isEmailVerified ? "bg-green-500" : "bg-red-500"}`}
                                                    />
                                                    <span className="text-sm">Email</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <div
                                                        className={`h-2 w-2 rounded-full ${user.isPhoneVerified ? "bg-green-500" : "bg-red-500"}`}
                                                    />
                                                    <span className="text-sm">Phone</span>
                                                </div>
                                                {user.twoFactorEnabled && <Shield className="h-4 w-4 text-green-500" />}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{user.metrics.totalOrders}</div>
                                                <div className="text-muted-foreground">
                                                    Avg: {formatCurrency(user.metrics.averageOrderValue)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{formatCurrency(user.metrics.totalSpent)}</div>
                                                <div className="text-muted-foreground">LTV: {formatCurrency(user.metrics.lifetimeValue)}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{user.lastLogin ? formatDate(new Date(user.lastLogin)) : "Never"}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{formatDate(new Date(user.createdAt))}</div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/users/${user.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {/* <DropdownMenuItem asChild>
                                                        <Link href={`/admin/users/${user.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit User
                                                        </Link>
                                                    </DropdownMenuItem> */}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                                        {user.status === UserStatus.ACTIVE ? (
                                                            <>
                                                                <UserX className="mr-2 h-4 w-4" />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="mr-2 h-4 w-4" />
                                                                Activate
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    {/* <DropdownMenuItem asChild>
                                                        <Link href={`/admin/users/${user.id}/reset-password`}>
                                                            <Key className="mr-2 h-4 w-4" />
                                                            Reset Password
                                                        </Link>
                                                    </DropdownMenuItem> */}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600" onClick={() => setDeleteUser(user)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <DeleteUserModal user={deleteUser} open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)} />
        </>
    )
}
