'use client'

import { Product } from '@/types/product.types'
import React, { MouseEventHandler, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { Edit, Undo, X } from 'lucide-react'
import { Label } from '../ui/label'
import { Item, ItemActions, ItemGroup, ItemHeader } from '../ui/item'
import Image from 'next/image'
import { FileInput } from '../ui/file-input'
import { Spinner } from '../ui/spinner'
import { uploadFile } from '@/lib/actions/files-manager'
import { updateProduct } from '@/lib/actions/product.actions'
import { toast } from 'sonner'

interface Props{
    product: Product
}

export default function EditProductImages({product}: Props) {
    const [open, setOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<File[]>([])
    const [prevImages, setPrevImages] = useState(product.images || [])

    const handleRemoveImage = (index:number)=>{
        setPrevImages(prv => prv.filter((_, idx)=> idx !== index))
    }

    const handleReset = ()=>setPrevImages(product.images||[])

    const handleChangeImages: MouseEventHandler<HTMLButtonElement> = async(e)=>{
        try {
            let allImages = [...prevImages]
            const signal = new AbortController()
            setUploading(true)
            // upload many files
            if (images.length) {
                const formData = new FormData()

                images.map(img =>{
                    formData.append("file", img, img.name)
                })

                const uploaded = await uploadFile(formData, signal.signal, true) as unknown as string[]

                allImages = [...allImages, ...uploaded.map(itm => ({url: itm}))]
            }

            // Update images in db
            const res = await updateProduct(product.id, {images: allImages, isInStock: product.isInStock})

            if (!res.success) {
                console.log(res)
                toast.error('Failed to update product images...')
                return
            }

            setImages([])
            setPrevImages(allImages)

            toast.success('Product images updated successfully')

            setOpen(false)
            
        } catch (error) {
            
        }finally{
            setUploading(false)
        }
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <Button variant={'default'} className="cursor-pointer">
                <Edit /> Edit Images
            </Button>
        </DialogTrigger>
        <DialogContent onInteractOutside={(e)=>e.preventDefault()} className='overflow-y-auto'>
            <DialogHeader>
                <DialogTitle>Edit Product Images</DialogTitle>
                <DialogDescription>{product.name}</DialogDescription>
            </DialogHeader>

            {/* Display images and input to add more */}
            <div className='flex justify-between items-center'>
                <Label>Existing Photos</Label>
                {
                    (product.images||[]).length !== prevImages.length && <Button variant={'outline'} onClick={handleReset} className='cursor-pointer'>
                    <Undo /> Reset
                </Button>
                }
            </div>
            <div className="flex w-full max-w-xl lg:max-w-3xl flex-col gap-6">
              <ItemGroup className="grid grid-cols-3 gap-4">
                {prevImages.slice(0, 5).map((img, index) => (
                  <Item key={img.url + index} variant="outline" className='relative'>
                    <ItemHeader>
                      <Image
                        src={img.url}
                        alt={img.altText || product.name}
                        width={128}
                        height={128}
                        className="aspect-square w-full rounded-sm object-cover"
                      />
                    </ItemHeader>
                    <div className='absolute top-0 right-0 w-5 rounded-full border text-red-400' onClick={()=> handleRemoveImage(index)}>
                        <X />
                    </div>
                  </Item>
                ))}
              </ItemGroup>
            </div>

            <Label htmlFor='upload-new-photos'>Upload New Photos</Label>
            <FileInput
                onFilesChange={setImages}
                maxFiles={30}
                showPreview
                value={images}
                accept='image/*'
            />

            <DialogFooter>
                <DialogClose asChild disabled={uploading}>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleChangeImages} disabled={uploading}>{
                        uploading ? <><Spinner /> Saving</> : 'Save changes'
                    }</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
