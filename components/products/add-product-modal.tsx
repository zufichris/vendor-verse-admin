"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type * as z from "zod"
import { Plus, X, ImagePlus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
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
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FormSubmitButton } from "@/components/forms/form-submit-button"
import { productSchema, type ProductFormValues } from "@/lib/validations/schema"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { VariantCombinationsSkeleton } from "./variant-combinations-skeleton"

export function AddProductModal() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTag, setCurrentTag] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [images, setImages] = useState<Array<{ id: string; url: string; alt?: string; isUploading?: boolean }>>([])
  const [currentVariantValue, setCurrentVariantValue] = useState("")
  const [isLoadingCombinations, setIsLoadingCombinations] = useState(false)

  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"] as const

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      stock: 0,
      sku: "",
      status: "draft",
      currency: "USD",
      trackInventory: false,
      variants: [{ name: "", values: [] }],
      variantProducts: [],
      tags: [],
      images: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  })

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = async (file: File) => {
    const imageId = Math.random().toString(36).substr(2, 9)
    setImages((prev) => [...prev, { id: imageId, url: URL.createObjectURL(file), isUploading: true }])

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, isUploading: false } : img)))
  }

  const generateVariantCombinations = () => {
    const variantValues = fields.map((field, index) => {
      const values = form.getValues(`variants.${index}.values`)
      return values || []
    })

    if (!variantValues.length || variantValues.some((values) => !values.length)) return []

    const combinations: Record<string, string>[] = variantValues.reduce(
      (acc: Record<string, string>[], values: string[]) => {
        if (!values.length) return acc
        const newCombinations: Record<string, string>[] = []
        acc.forEach((combination) => {
          values.forEach((value) => {
            newCombinations.push({
              ...combination,
              [fields[variantValues.indexOf(values)].name]: value,
            })
          })
        })
        return newCombinations
      },
      [{}],
    )

    return combinations
  }

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Success",
        description: "Product added successfully",
      })

      setOpen(false)
      form.reset()
      setTags([])
      setImages([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (
    name: keyof ProductFormValues,
    label: string,
    description: string,
    type: "text" | "number" | "textarea" = "text",
    required = false,
    props = {},
  ) => (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor={name} className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {type === "textarea" ? (
        <Textarea
          id={name}
          {...form.register(name)}
          className={cn(form.formState.errors[name] && "border-red-500")}
          required={required}
          {...props}
        />
      ) : (
        <Input
          id={name}
          type={type}
          {...form.register(name)}
          className={cn(form.formState.errors[name] && "border-red-500")}
          required={required}
          {...props}
        />
      )}
      {form.formState.errors[name] && <p className="text-sm text-red-500">{form.formState.errors[name]?.message}</p>}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] md:max-w-4xl overflow-hidden  p-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory. Fill in all the required information below.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(95vh-12rem)]">
            <div className="grid gap-6 p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <ScrollArea className="w-full">
                  <TabsList className="w-full sticky inline-flex h-auto p-1 mb-4">
                    {["basic", "pricing", "inventory", "variants", "media"].map((tab) => (
                      <TabsTrigger key={tab} value={tab} className="flex-1 whitespace-nowrap capitalize">
                        {tab.replace("-", " ")}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4 mt-0 min-h-full overflow-y-scroll p-2">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField(
                        "name",
                        "Product Name",
                        "The name of your product as it will appear to customers",
                        "text",
                        true,
                      )}
                      {renderField("brand", "Brand", "The manufacturer or brand name of the product", "text")}
                    </div>
                    {renderField(
                      "description",
                      "Description",
                      "A detailed description of your product's features and benefits",
                      "textarea",
                      true,
                    )}
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label>Tags</Label>
                        <p className="text-sm text-muted-foreground">
                          Add keywords to help customers find your product
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-2">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          placeholder="Enter a tag"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                        />
                        <Button type="button" onClick={handleAddTag}>
                          Add Tag
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pricing Tab */}
                <TabsContent value="pricing" className="space-y-4 mt-0 min-h-full overflow-y-scroll p-2">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField("price", "Price", "The base price of your product", "number", true, {
                        min: "0",
                        step: "0.01",
                      })}
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select onValueChange={(value) => form.setValue("currency", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Inventory Tab */}
                <TabsContent value="inventory" className="space-y-4 mt-0 min-h-full overflow-y-scroll p-2">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField(
                        "sku",
                        "SKU",
                        "Stock Keeping Unit - Your unique identifier for this product",
                        "text",
                        true,
                      )}
                      {renderField("stock", "Stock", "Current stock level", "number", true, { min: "0" })}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Track Inventory</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically update stock levels when orders are placed
                        </p>
                      </div>
                      <Switch {...form.register("trackInventory")} />
                    </div>
                  </div>
                </TabsContent>

                {/* Variants Tab */}
                <TabsContent value="variants" className="space-y-4 mt-0 min-h-full overflow-y-scroll p-2">
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-2">
                              <Label>Variant Name</Label>
                              <Input {...form.register(`variants.${index}.name`)} placeholder="e.g., Size, Color" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <Label>Variant Values</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={currentVariantValue}
                                  onChange={(e) => setCurrentVariantValue(e.target.value)}
                                  placeholder="e.g., Small, Red"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      if (currentVariantValue.trim()) {
                                        const currentValues = form.getValues(`variants.${index}.values`) || []
                                        form.setValue(`variants.${index}.values`, [
                                          ...currentValues,
                                          currentVariantValue.trim(),
                                        ])
                                        setCurrentVariantValue("")
                                      }
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    if (currentVariantValue.trim()) {
                                      const currentValues = form.getValues(`variants.${index}.values`) || []
                                      form.setValue(`variants.${index}.values`, [
                                        ...currentValues,
                                        currentVariantValue.trim(),
                                      ])
                                      setCurrentVariantValue("")
                                    }
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {(form.getValues(`variants.${index}.values`) || []).map((value, valueIndex) => (
                                  <Badge key={valueIndex} variant="secondary">
                                    {value}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 ml-1 hover:bg-transparent"
                                      onClick={() => {
                                        const currentValues = form.getValues(`variants.${index}.values`) || []
                                        form.setValue(
                                          `variants.${index}.values`,
                                          currentValues.filter((_, i) => i !== valueIndex),
                                        )
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ name: "", values: [] })}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Variant
                    </Button>
                  </div>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-4 mt-0 min-h-full overflow-y-scroll p-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Product Images</Label>
                      <p className="text-sm text-muted-foreground">
                        Add high-quality images that best showcase your product
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <Card key={image.id} className="relative group">
                          <div className="aspect-square relative">
                            {image.isUploading && (
                              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            )}
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={image.alt || "Product image"}
                              className="aspect-square object-cover rounded-lg"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setImages(images.filter((img) => img.id !== image.id))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </Card>
                      ))}
                      <Card className="flex aspect-square items-center justify-center">
                        <input
                          type="file"
                          id="image-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(file)
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-full w-full"
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          <ImagePlus className="h-8 w-8" />
                        </Button>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
          <DialogFooter className="px-6 py-4">
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <FormSubmitButton>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                "Add Product"
              )}
            </FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

