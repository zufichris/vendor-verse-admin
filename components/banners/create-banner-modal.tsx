'use client'

import React, { ReactNode, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { CreateBannerForm } from './create-banner-form'
import { BannerFormValues } from '@/lib/validations/banner.validations'
import { createBanner } from '@/lib/actions/banner.actions'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '../ui/separator'

interface Props{
    trigger?: ReactNode,
    defaultOpen?: boolean,
    onClickOutside?: ((event: any) => void) | undefined
}

export default function CreateBannerModal({trigger, defaultOpen, onClickOutside}:Props) {
    const [open, setOpen] = useState(defaultOpen || false)
    const onSubmit = async(data: BannerFormValues)=>{
        await createBanner(data)
        setOpen(false)
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            {
                trigger ?? <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Banner
                </Button>
            }
            
        </DialogTrigger>
        <DialogContent onInteractOutside={onClickOutside}>
            <DialogHeader>
                <DialogTitle>Add A New Banner</DialogTitle>
                <DialogDescription>Fill the form and submit in order to create a new banner. This will be reflected on the website immediately</DialogDescription>
            </DialogHeader>
            <Separator />
            <CreateBannerForm onSubmit={onSubmit} />
        </DialogContent>
    </Dialog>
  )
}
