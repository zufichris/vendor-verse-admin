"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { FormSubmitButton } from "@/components/forms/form-submit-button"
import { createNewUser } from "@/lib/actions/user"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function AddCustomerModal() {
  const { toast } = useToast()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function onSubmit(formData: FormData) {
    const data = {
      email: formData.get("email")?.toString()!,
      password: formData.get("password")?.toString()!,
      firstName: formData.get("firstName")?.toString()!,
      lastName: formData.get("lastName")?.toString()!,
      phoneNumber: formData.get("phoneNumber")?.toString()!,
    }
    const res = await createNewUser(data)
    toast(res)
    if (res.success) {
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your database. Fill in the customer&apos;s information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="firstName" className="sm:text-right">
                First Name
              </Label>
              <div className="sm:col-span-3">
                <Input id="firstName" name="firstName" placeholder="Customer First Name" required />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="lastName" className="sm:text-right">
                Last Name
              </Label>
              <div className="sm:col-span-3">
                <Input id="lastName" name="lastName" placeholder="Customer Last Name" required />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="email" className="sm:text-right">
                Email
              </Label>
              <div className="sm:col-span-3">
                <Input id="email" name="email" type="email" placeholder="customer@example.com" required />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="phoneNumber" className="sm:text-right">
                Phone
              </Label>
              <div className="sm:col-span-3">
                <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+1 234 567 890" />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
              <Label htmlFor="password" className="sm:text-right">
                Password
              </Label>
              <div className="sm:col-span-3">
                <Input id="password" name="password" type="password" placeholder="Password" />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <FormSubmitButton>Add Customer</FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

