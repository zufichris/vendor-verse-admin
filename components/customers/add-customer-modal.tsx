"use client"

import { useState, useTransition } from "react"
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

export function AddCustomerModal() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  async function onSubmit(formData: FormData) {
    try {
      const data = {
        email: formData.get("email")?.toString()!,
        password: formData.get("password")?.toString()!,
        firstName: formData.get("firstName")?.toString()!,
        lastName: formData.get("lastName")?.toString()!,
        phoneNumber: formData.get("phoneNumber")?.toString()!,
      }
      const res = await createNewUser(data)
      if (!res.success) {
        throw new Error("Error Creating User")
      }
      setOpen(false)
      toast({
        title: "User Created Successful"
      })
    } catch (error) {
      toast({
        title: "Error Creating User",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to your database. Fill in the customer&apos;s information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input id="firstName" name="firstName" placeholder="Customer First Name" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input id="lastName" name="lastName" placeholder="Customer LastName" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="customer@example.com"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+1 234 567 890" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Password
              </Label>
              <Input id="password" name="password" type="password" placeholder="Password" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <FormSubmitButton>Add Customer</FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

