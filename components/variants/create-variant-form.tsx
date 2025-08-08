"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { type CreateVariantDto, CreateVariantDtoSchema } from "@/lib/actions/variant.actions"
import type { Product } from "@/types/product.types"
import { createVariant } from "@/lib/actions/variant.actions"

interface CreateVariantFormProps {
  product: Product
}

export function CreateVariantForm({ product }: CreateVariantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [attributes, setAttributes] = useState<Record<string, string>>({})
  const [currentAttributeKey, setCurrentAttributeKey] = useState("")
  const [currentAttributeValue, setCurrentAttributeValue] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<CreateVariantDto>({
    resolver: zodResolver(CreateVariantDtoSchema),
    defaultValues: {
      productId: product.id,
      sku: "",
      name: "",
      price: product.price,
      currency: product.currency,
      stockQuantity: 0,
      attributes: {},
    },
  })

  const handleAddAttribute = () => {
    if (currentAttributeKey.trim() && currentAttributeValue.trim()) {
      const newAttributes = { ...attributes, [currentAttributeKey.trim()]: currentAttributeValue.trim() }
      setAttributes(newAttributes)
      form.setValue("attributes", newAttributes)
      setCurrentAttributeKey("")
      setCurrentAttributeValue("")
    }
  }

  const handleRemoveAttribute = (key: string) => {
    const newAttributes = { ...attributes }
    delete newAttributes[key]
    setAttributes(newAttributes)
    form.setValue("attributes", newAttributes)
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files)
      setImageFiles((prev) => [...prev, ...newFiles])

      // Convert to image objects for form
      const imageObjects = newFiles.map((file) => ({
        url: URL.createObjectURL(file),
        altText: file.name,
      }))

      const currentImages = form.getValues("images") || []
      form.setValue("images", [...currentImages, ...imageObjects])
    }
  }

  const handleThumbnailUpload = (file: File) => {
    setThumbnailFile(file)
    form.setValue("thumbnail", {
      url: URL.createObjectURL(file),
      altText: file.name,
    })
  }

  const onSubmit = async (data: CreateVariantDto) => {
    setIsSubmitting(true)
    try {
      const result = await createVariant(data)

      if (result.success) {
        toast({
          title: "Variant Created",
          description: "Your variant has been created successfully.",
        })
        router.push(`/admin/products/${product.id}/variants`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create variant",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-primary">Basic Information</h3>
            <p className="text-sm text-muted-foreground">Essential variant details and identification</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter unique SKU" {...field} />
                  </FormControl>
                  <FormDescription>Unique SKU for this variant</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Black Large" {...field} />
                  </FormControl>
                  <FormDescription>Display name for this variant</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-primary">Pricing</h3>
            <p className="text-sm text-muted-foreground">Set pricing for this specific variant</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Price for this specific variant</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Currency code for variant pricing</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>Percentage discount for variant</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Inventory */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-primary">Inventory</h3>
            <p className="text-sm text-muted-foreground">Stock management for this variant</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Stock quantity for this variant</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormDescription>Weight of this variant</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Attributes */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-primary">Attributes</h3>
            <p className="text-sm text-muted-foreground">Define variant-specific attributes like color, size, etc.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Attribute name (e.g., Color)"
                value={currentAttributeKey}
                onChange={(e) => setCurrentAttributeKey(e.target.value)}
              />
              <div className="flex space-x-2">
                <Input
                  placeholder="Value (e.g., Red)"
                  value={currentAttributeValue}
                  onChange={(e) => setCurrentAttributeValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddAttribute()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddAttribute}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {Object.keys(attributes).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(attributes).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="px-3 py-1">
                    {key}: {value}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveAttribute(key)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">Variant attributes (e.g., color: red, size: large)</p>
          </div>
        </div>

        <Separator />

        {/* Images */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-primary">Variant Images</h3>
            <p className="text-sm text-muted-foreground">Upload images specific to this variant</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormLabel>Thumbnail Image</FormLabel>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {thumbnailFile ? (
                  <div className="space-y-2">
                    <img
                      src={URL.createObjectURL(thumbnailFile) || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground">{thumbnailFile.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setThumbnailFile(null)
                        form.setValue("thumbnail", undefined)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div>
                      <Button type="button" variant="outline" asChild>
                        <label htmlFor="thumbnail-upload" className="cursor-pointer">
                          Upload Thumbnail
                        </label>
                      </Button>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleThumbnailUpload(file)
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Main image for this variant</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <FormLabel>Additional Images</FormLabel>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <div className="space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div>
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="images-upload" className="cursor-pointer">
                        Upload Images
                      </label>
                    </Button>
                    <input
                      id="images-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Images specific to this variant</p>
                </div>
              </div>

              {imageFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Variant image ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => {
                          const newFiles = imageFiles.filter((_, i) => i !== index)
                          setImageFiles(newFiles)
                          const imageObjects = newFiles.map((file) => ({
                            url: URL.createObjectURL(file),
                            altText: file.name,
                          }))
                          form.setValue("images", imageObjects)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/products/${product.id}/variants`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Variant"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
