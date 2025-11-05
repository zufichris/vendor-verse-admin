'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toggleUserStatus } from "@/lib/actions/user.actions"
import { User, UserStatus } from "@/types/user.types"
import { UserCheck, UserX } from "lucide-react"
import { useState } from "react"
import { Spinner } from "../ui/spinner"

interface Props{
    user: User
}

export function ActivateDeactivateUserModal({user}:Props) {
    const [submitting, setSubmitting] = useState(false)

    const handleToggleStatus = async () => {
        try {
            setSubmitting(true)
            const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE
            await toggleUserStatus(user.id, newStatus)
        } catch (error) {
            console.log(error)
        }finally{
            setSubmitting(false)
        }
    }
    
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
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
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to set user status to: {user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE}?</AlertDialogTitle>
          <AlertDialogDescription>
            You can always change the status back
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={submitting} onClick={handleToggleStatus}>
            {
                submitting ? <><Spinner /> Processing</> : 'Continue'
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
