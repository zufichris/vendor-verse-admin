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
import { Textarea } from "@/components/ui/textarea"
import { Ban } from "lucide-react"
import { FormSubmitButton } from "@/components/forms/form-submit-button"

export function BlockVendorModal() {
  const [open, setOpen] = useState(false)

  async function onSubmit(formData: FormData) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Ban className="mr-2 h-4 w-4" />
          Block Vendor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Block Vendor</DialogTitle>
            <DialogDescription>
              This action will temporarily suspend the vendor&apos;s ability to sell on the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Reason for blocking</h3>
              <Textarea name="reason" placeholder="Please provide a reason for blocking this vendor..." required />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <FormSubmitButton>Block Vendor</FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

