'use client'

import React, { ReactNode, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { BannerFormValues } from '@/lib/validations/banner.validations'
import { updateBanner } from '@/lib/actions/banner.actions'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Banner } from '@/types/product.types'
import { UpdateBannerForm } from './update-banner-form'

interface Props{
    trigger?: ReactNode,
    defaultOpen?: boolean,
    onClickOutside?: ((event: any) => void) | undefined,
    banner: Banner
}

export default function UpdateBannerModal({trigger, defaultOpen, onClickOutside, banner}:Props) {
    const [open, setOpen] = useState(defaultOpen || false)
    const onSubmit = async(data: BannerFormValues)=>{
        await updateBanner(banner.id, data)
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
            <UpdateBannerForm initialData={banner} onSubmit={onSubmit} onCancel={()=>setOpen(false)} />
        </DialogContent>
    </Dialog>
  )
}
