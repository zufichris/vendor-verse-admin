"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { type User, UserStatus, UserRole } from "@/types/user.types"
import { deleteUser } from "@/lib/actions/user.actions"

interface DeleteUserModalProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function DeleteUserModal({ user, open, onOpenChange }: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!user) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteUser(user.id)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to delete user:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account and all associated data.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
            <div className="relative h-12 w-12">
              <Image
                src={user.profileImage || "/placeholder.svg?height=48&width=48"}
                alt={`${user.firstName} ${user.lastName}`}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-medium">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={roleColors[user.role]}>{user.role}</Badge>
                <Badge className={statusColors[user.status]}>{user.status.replace("_", " ")}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium">Total Orders</div>
              <div className="text-muted-foreground">{user.metrics.totalOrders}</div>
            </div>
            <div>
              <div className="font-medium">Total Spent</div>
              <div className="text-muted-foreground">{formatCurrency(user.metrics.totalSpent)}</div>
            </div>
            <div>
              <div className="font-medium">Loyalty Points</div>
              <div className="text-muted-foreground">{user.metrics.loyaltyPoints}</div>
            </div>
            <div>
              <div className="font-medium">Reviews</div>
              <div className="text-muted-foreground">{user.metrics.reviewsCount}</div>
            </div>
          </div>

          {user.metrics.totalOrders > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div className="text-sm text-yellow-800">
                  <div className="font-medium">Warning</div>
                  <div>
                    This user has {user.metrics.totalOrders} orders. Deleting will affect order history and analytics.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
