"use client"

import { ChangeEventHandler, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { useEditor } from "@tiptap/react"
import { getDefaultEditorConfig } from "@/lib/tiptap-utils"
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor"
import { uploadFile } from "@/lib/actions/files-manager"
import { Api } from "@/utils/api"
import { toast } from "sonner"
import { Blog } from "@/types/blog"
import { Label } from "../ui/label"
import { Upload } from "lucide-react"

// Validation schema
const blogFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(150, "Title must be less than 150 characters"),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(300, "Summary must be less than 300 characters"),
  mainImageUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  tags: z.string().min(1, "Add at least one tag"),
  jsonContent: z.object({}).passthrough().optional(),
  htmlContent: z.string(),
})

type BlogFormValues = z.infer<typeof blogFormSchema>

export function BlogForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [imageValid, setImageValid] = useState(true);
  const editor = useEditor(getDefaultEditorConfig())

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      summary: "",
      mainImageUrl: "",
      tags: "",
      jsonContent: undefined,
      htmlContent: "",
    },
  })

  const imageDisplayUrl = form.watch("mainImageUrl");

  useEffect(() => {
    if (!imageDisplayUrl || uploadingMainImage) {
      setImageValid(true)
      form.clearErrors("mainImageUrl")
      return
    }

    // Validate image URL by attempting to load it
    const img = new Image()
    img.onload = () => {
      setImageValid(true)
      form.clearErrors("mainImageUrl")
    }
    img.onerror = () => {
      setImageValid(false)
      form.setError("mainImageUrl", { type: "manual", message: "Invalid image URL" })
    }
    img.src = imageDisplayUrl
  }, [imageDisplayUrl, uploadingMainImage])

  async function onSubmit(values: BlogFormValues) {
    setIsLoading(true)
    try {
        values.jsonContent = editor?.getJSON() || {}
        values.htmlContent = editor?.getHTML() || ""

        const data = await Api.post<Blog>("/blogs", {...values, tags: values.tags.split(",").map(tag => tag.trim())});

        if (!data.data) {
          throw new Error("Failed to create blog post");
        }

        router.push(`/blogs/${data.data.slug}`)
    } catch (error) {
      console.error("Error creating blog:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMainImageChange:ChangeEventHandler<HTMLInputElement> = async(e)=>{
    const file = e.target.files?.[0];

    if (!file) {
        toast("Error", {
            
            description: "No file was selected"
        })
        return
    };

    if (!file.type.startsWith('image')) {
        toast("Error", {
            
            description: "Please only upload images"
        })
        return;
    }
    setUploadingMainImage(true)

    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = await uploadFile(formData) as unknown as string
      form.setValue('mainImageUrl', url)
    } catch (error) {
      console.error("Error uploading image:", error);
    }finally{
        setUploadingMainImage(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter blog post title"
                  {...field}
                />
              </FormControl>
              <FormDescription>The main title of your blog post (5-150 characters)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Summary */}
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief summary of your blog post" className="resize-none" rows={3} {...field} />
              </FormControl>
              <FormDescription>A short description that appears in blog listings (10-300 characters)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Featured Image URL */}
        <FormField
          control={form.control}
          name="mainImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image URL</FormLabel>
              <FormControl>
                <div>
                    <div className="flex items-center justify-center gap-2">
                        <Input placeholder="https://example.com/image.jpg" {...field} disabled={uploadingMainImage} />
                        <Button asChild type="button"  variant={'outline'} className="flex items-center justify-center cursor-pointer relative">
                            <Label htmlFor="uploadMainImage">
                            <Upload className="mr-2 h-4 w-4" />
                            <Input type="file" accept="image/*" name="uploadMainImage" id="uploadMainImage" className="absolute w-0 h-0 -z-50" onChange={handleMainImageChange} />
                            </Label>
                        </Button>
                    </div>
                    {/* Render image to detect if main image string is a valid image url. if not set form  errors */}
                    {
                        imageDisplayUrl && !uploadingMainImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageDisplayUrl} alt="Featured Image Preview" className="mt-4 max-h-48 object-cover rounded-md border" onError={()=>{
                                form.setError('mainImageUrl', {type: 'manual', message: 'Invalid image URL'})
                            }} onLoad={()=>{
                                form.clearErrors('mainImageUrl')
                            }} />
                        )
                    }
                    {
                        uploadingMainImage && (
                            <div className="mt-4 flex items-center space-x-2">
                                <Spinner className="h-5 w-5"/>
                                <span>Uploading image...</span>
                            </div>
                        )
                    }
                </div>
              </FormControl>
              <FormDescription>URL to your featured image (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="React, Next.js, Web Development" {...field} />
              </FormControl>
              <FormDescription>Comma-separated tags for categorizing your post</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tiptap Editor */}
        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            {
                !editor ? <div>Loading editor <Spinner/></div> : <SimpleEditor editor={editor} />
            }
          </FormControl>
          <FormDescription>Write your blog post content using the rich text editor</FormDescription>
        </FormItem>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
            {isLoading ? "Publishing..." : "Publish Blog Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
