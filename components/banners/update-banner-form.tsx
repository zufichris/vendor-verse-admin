"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { BannerFormValues, bannerSchema } from "@/lib/validations/banner.validations"
import { uploadFile } from "@/lib/actions/files-manager"
import Image from "next/image"
import { FileInput } from "../ui/file-input"

interface UpdateBannerFormProps {
  initialData: BannerFormValues
  onSubmit: (data: BannerFormValues) => Promise<void>
  onCancel?: () => void
}

export function UpdateBannerForm({ initialData, onSubmit, onCancel }: UpdateBannerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null)


  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      ...initialData,
      description: initialData.description ?? "",
      cta: initialData.cta ?? "",
      image: initialData.image ?? "",
      color: initialData.color ?? "",
      link: initialData.link ?? "",
      video: initialData?.video || ""
    },
  })

  const handleSubmit = async (data: BannerFormValues) => {
    setIsSubmitting(true)
    try {
        // Upload the file (if any)
       if (selectedBanner) {
        const formData = new FormData()
        formData.append('file', selectedBanner, selectedBanner.name)
 
        const url = await uploadFile(formData) as unknown as string;
        if (selectedBanner.type.startsWith('image/')) {
          data.image = url;
          data.video = ''
        }else{
          data.image = ''
          data.video = url
        }
       }

      await onSubmit({
        ...data,
        link: data.link?.startsWith('/shop') ? data.link : `/shop`
      })
    } catch (error) {
      console.error("[v0] Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter banner title" {...field} />
              </FormControl>
              <FormDescription>The main title displayed on the banner</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="Enter subtitle" {...field} />
              </FormControl>
              <FormDescription>A unique subtitle for the banner (will be converted to lowercase)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="banner-slug" {...field} />
              </FormControl>
              <FormDescription>URL-friendly identifier (must be unique)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter banner description" className="resize-none" rows={4} {...field} />
              </FormControl>
              <FormDescription>Optional detailed description of the banner</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="cta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Call to Action</FormLabel>
                <FormControl>
                  <Input placeholder="Learn More" {...field} />
                </FormControl>
                <FormDescription>Button text</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="#000000" {...field} />
                </FormControl>
                <FormDescription>Hex color code</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {
            form.getValues('image') && !selectedBanner && <Image src={form.getValues('image')!} alt={form.getValues('title')} width={100} height={100} />
        }
        {
            form.getValues('video') && !selectedBanner && <video controls src={form.getValues('video')!} width={100} height={100} />
        }

        <FileInput
            maxFiles={1}
            accept="image/*, video/*"
            onFilesChange={(files) => setSelectedBanner(files[0])}
            value={selectedBanner ? [selectedBanner] : []}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>Where the banner should link to</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Update Banner
          </Button>
        </div>
      </form>
    </Form>
  )
}
