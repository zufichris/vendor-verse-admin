'use client'

import { cn } from '@/lib/utils'
import React, { ChangeEventHandler, useState } from 'react'
import { Label } from '../ui/label'
import { Edit } from 'lucide-react'
import { Input } from '../ui/input'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
import { uploadFile } from '@/lib/actions/files-manager'
import { updateProduct } from '@/lib/actions/product.actions'

interface Props{
    className?: string,
    productId: string,
    inStock: boolean
}

export default function ThumbnailUploader({className, productId, inStock}: Props) {
    const [uploading, setUploading] = useState(false)
    
    const handleThumbnailChange:ChangeEventHandler<HTMLInputElement> = async(e)=>{
        try {
            const file = e.target.files?.[0]

            if (!file || !file.type.startsWith('image')) {
                toast("Invalid or no file selected", {
                    position:'bottom-right'
                })
                return
            }

            setUploading(true)
            const formData = new FormData()
            formData.append('file', file, file.name)

            const url = await uploadFile(formData) as unknown as string

            if (!url) {
                toast('Failed to upload file')
                return
            }

            const res = await updateProduct(productId, {thumbnail:{url}, isInStock: inStock})

            if (res.success) {
                toast.success("Product thumbnail updated successfully")   
            }else{
                toast.error("Failed to update product thumbnail")
            }
        } catch (error) {
            console.error(error)
            toast("Upload failed", {
                position: 'bottom-right'
            })
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className={cn(className ||'', uploading && 'visible')}>
            <Label htmlFor="upload-thumbnail">
                {
                    uploading ? <Spinner className='w-12'/> : <Edit size={40} className="cursor-pointer" />
                }
            </Label>
            <Input id="upload-thumbnail" className="absolute w-0 h-0 invisible" type="file" accept="image/*" onChange={handleThumbnailChange} />
        </div>
    )
}
