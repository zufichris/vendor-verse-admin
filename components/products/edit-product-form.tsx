"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { type UpdateProductDto, UpdateProductDtoSchema } from "@/types/product.dto"
import type { Product, ProductCategory } from "@/types/product.types"
import { updateProduct } from "@/lib/actions/product.actions"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEditor } from "@tiptap/react"
import { getDefaultEditorConfig } from "@/lib/tiptap-utils"
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor"

interface EditProductFormProps {
    product: Product
    categories: ProductCategory[]
}

export function EditProductForm({ product, categories }: EditProductFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [tags, setTags] = useState<string[]>(product.tags || [])
    const [currentTag, setCurrentTag] = useState("")
    const router = useRouter()
    const { toast } = useToast()

    const jsonDesc = useMemo(()=>{
        let content = {}
        try {
            content = typeof product.description === 'string' ? JSON.parse(product.description) : product.description
        } catch (e) {
            console.log(`Json parse error`, e)
        }

        return content;
    },[])

    const editor = useEditor(getDefaultEditorConfig())

    const form = useForm<any>({
        resolver: zodResolver(UpdateProductDtoSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            currency: product.currency,
            categoryId: product.categoryId,
            brand: product.brand || "",
            tags: product.tags || [],
            type: product.type,
            status: product.status,
            visibility: product.visibility,
            condition: product.condition,
            featured: product.featured,
            stockQuantity: product.stockQuantity,
            discountPercentage: product.discountPercentage,
            updatedById: "current-user-id",
        },
    })

    const productType = form.watch("type")

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            const newTags = [...tags, currentTag.trim()]
            setTags(newTags)
            form.setValue("tags", newTags)
            setCurrentTag("")
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove)
        setTags(newTags)
        form.setValue("tags", newTags)
    }

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        try {
            const desc = editor.getJSON()

            data.description = JSON.stringify(desc)
            const result = await updateProduct(product.id, data)

            if (result.success) {
                toast({
                    title: "Product Updated",
                    description: "Your product has been updated successfully.",
                })
                router.push(`/products/${result.data.slug}`)
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to update product",
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


    useEffect(()=>{
        if (editor) {
            editor.commands.setContent(jsonDesc)
        }
    }, [editor])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-primary">Basic Information</h3>
                        <p className="text-sm text-muted-foreground">Essential product details that customers will see</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    <FormDescription>The product name as it will appear on the website</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Brand name" {...field} />
                                    </FormControl>
                                    <FormDescription>Brand or manufacturer name</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description *</FormLabel>
                                <FormControl>
                                    <SimpleEditor editor={editor} />
                                    {/* <Textarea placeholder="Describe your product in detail..." className="min-h-[100px]" {...field} /> */}
                                </FormControl>
                                <FormDescription>Detailed description of the product for customers</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>ID of the category this product belongs to</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Type *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="simple">Simple</SelectItem>
                                            <SelectItem value="configurable">Configurable</SelectItem>
                                            <SelectItem value="virtual">Virtual</SelectItem>
                                            <SelectItem value="downloadable">Downloadable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Product type determines how variants are handled</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Condition</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select condition" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="used">Used</SelectItem>
                                            <SelectItem value="refurbished">Refurbished</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Physical condition of the product</FormDescription>
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
                        <p className="text-sm text-muted-foreground">Set your product pricing and discount information</p>
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
                                    <FormDescription>Base price of the product in the specified currency</FormDescription>
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
                                    <FormDescription>Three-letter currency code (e.g., USD, EUR)</FormDescription>
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
                                    <FormDescription>Percentage discount to apply (0-100)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator />

                {/* Inventory & Status */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-primary">Inventory & Status</h3>
                        <p className="text-sm text-muted-foreground">Manage stock levels and product visibility</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    <FormDescription>Available quantity in inventory</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Current status of the product</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="visibility"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Visibility *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="public">Public</SelectItem>
                                            <SelectItem value="private">Private</SelectItem>
                                            <SelectItem value="hidden">Hidden</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Who can see this product</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <FormField
                            control={form.control}
                            name="featured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Featured Product</FormLabel>
                                        <FormDescription>Whether to highlight this product in featured sections</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator />

                {/* Tags */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-primary">Tags</h3>
                        <p className="text-sm text-muted-foreground">Add tags to help customers find your product</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Enter a tag"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddTag()
                                    }
                                }}
                            />
                            <Button type="button" onClick={handleAddTag}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                                        {tag}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="ml-2 h-auto p-0 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <FormDescription>Keywords for better product discovery</FormDescription>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/products")}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Product"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
