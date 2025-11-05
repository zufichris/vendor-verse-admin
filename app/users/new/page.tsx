import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreateUserForm } from "@/components/users/create-user-form"

export default function NewUserPage() {
  return (
    <div className="flex-1 space-y-4  pt-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create User</h2>
        <p className="text-muted-foreground">Add a new user to your system.</p>
      </div>
      <CreateUserForm />
    </div>
  )
}
