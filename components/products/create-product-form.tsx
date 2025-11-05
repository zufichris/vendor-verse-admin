"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    type CreateProductDto,
    CreateProductDtoSchema,
} from "@/types/product.dto";
import type { ProductCategory } from "@/types/product.types";
import { createProduct } from "@/lib/actions/product.actions";
import { FileInput } from "../ui/file-input";
import { uploadFile } from "@/lib/actions/files-manager";
import { toast } from "sonner";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { getDefaultEditorConfig } from "@/lib/tiptap-utils";
import { useEditor } from "@tiptap/react";

interface CreateProductFormProps {
    categories: ProductCategory[];
}

export function CreateProductForm({ categories }: CreateProductFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [error, setError] = useState("");

    // Refs to reset file inputs
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const imagesInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const editor = useEditor(getDefaultEditorConfig())

    const form = useForm<CreateProductDto>({
        resolver: zodResolver(CreateProductDtoSchema),
        defaultValues: {
            name: "",
            description: " ",
            price: 0,
            currency: "AED",
            categoryId: "",
            brand: "",
            tags: [],
            images: [],
            thumbnail: { url: "", altText: "" },
            type: "simple",
            status: "draft",
            visibility: "public",
            condition: "new",
            featured: false,
            stockQuantity: 0,
            createdById: "current-user-id",
        },
    });

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            const newTags = [...tags, currentTag.trim()];
            setTags(newTags);
            form.setValue("tags", newTags);
            setCurrentTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(newTags);
        form.setValue("tags", newTags);
    };

    const onSubmit = async (data: CreateProductDto) => {
        if (!thumbnailFile) {
            toast.error("Validation Error", {
                description: "Please upload a thumbnail image"
            });
            return;
        }

        if (imageFiles.length === 0) {
            toast.error("Validation Error", {
                description: "Please upload at least one product image"
            });
            return;
        }

        const desc = JSON.stringify(editor.getJSON())

        if (!desc.trim()) {
            toast.error("Please add a product description!")
            return;
        }

        data.description = desc; 

        setIsSubmitting(true);
        setError("");

        try {
            const abortController = new AbortController()

            // Upload images first
            const thumbnailFormData = new FormData();
            thumbnailFormData.append('file', thumbnailFile, thumbnailFile.name);

            const imagesFormData = new FormData()

            imageFiles.map(file =>{
                imagesFormData.append('file', file, file.name);
            })

            const uploadedThumbnail = await uploadFile(thumbnailFormData, abortController.signal) as unknown as string;
            if (!uploadedThumbnail) {
                toast.error("Failed to upload thumbnail...")
                return
            }

            const imagesUploaded = await uploadFile(imagesFormData, abortController.signal, true) as unknown as string[]

            if (!imagesUploaded.length) {
                toast.error('Failed to upload images...')
                return
            }


            const result = await createProduct({
                ...data,
                thumbnail: {
                    url: uploadedThumbnail
                },
                images: imagesUploaded.map(itm => ({url: itm}))
            });

            if (result.success) {
                toast.error("Product Created", {
                    description: "Your product has been created successfully.",
                });

                router.push(`/products/${result.data.slug}`);
            } else {
                setError(result.message);
                toast("Error",{
                    description: result.message || "Failed to create product",
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            setError(errorMessage);
            toast.error("Error", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-primary">
                            Basic Information
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Essential product details that customers will see
                        </p>
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
                                    <FormDescription>
                                        The product name as it will appear on the website
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Auto-generated if empty" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Stock Keeping Unit - unique identifier for inventory
                                        tracking
                                    </FormDescription>
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
                                    {/* <Textarea
                                        placeholder="Describe your product in detail..."
                                        className="min-h-[100px]"
                                        {...field}
                                    /> */}
                                </FormControl>
                                <FormDescription>
                                    Detailed description of the product for customers
                                </FormDescription>
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
                                    {categories?.length ? (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
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
                                    ) : (
                                        <div className="text-destructive">
                                            Failed to load product categories
                                        </div>
                                    )}
                                    <FormDescription>
                                        ID of the category this product belongs to
                                    </FormDescription>
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

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Type *</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
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
                                    <FormDescription>
                                        Product type determines how variants are handled
                                    </FormDescription>
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
                        <p className="text-sm text-muted-foreground">
                            Set your product pricing and discount information
                        </p>
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
                                            onChange={(e) =>
                                                field.onChange(Number.parseFloat(e.target.value) || 0)
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Base price of the product in the specified currency
                                    </FormDescription>
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
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="AED">AED</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Three-letter currency code (e.g., USD, AED)
                                    </FormDescription>
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
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number.parseFloat(e.target.value) || undefined,
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Percentage discount to apply (0-100)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator />

                {/* Images */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-primary">Product Images</h3>
                        <p className="text-sm text-muted-foreground">
                            Upload high-quality images of your product (JPEG, PNG, GIF, WebP - max 5MB each)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <FormLabel>Thumbnail Image *</FormLabel>
                            <FileInput
                                accept="image/*"
                                maxFiles={1}
                                value={thumbnailFile ? [thumbnailFile] : []}
                                onFilesChange={(files)=> setThumbnailFile(files[0])}
                            />
                        </div>

                        <div className="space-y-4">
                            <FormLabel>Additional Images *</FormLabel>
                            <FileInput
                                accept="image/*"
                                maxFiles={30}
                                value={imageFiles}
                                onFilesChange={setImageFiles}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Inventory */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-primary">
                            Inventory & Status
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Manage stock levels and product visibility
                        </p>
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
                                            onChange={(e) =>
                                                field.onChange(Number.parseInt(e.target.value) || 0)
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Available quantity in inventory
                                    </FormDescription>
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
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
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
                                    <FormDescription>
                                        Current status of the product
                                    </FormDescription>
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
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
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
                                        <FormLabel className="text-base">
                                            Featured Product
                                        </FormLabel>
                                        <FormDescription>
                                            Whether to highlight this product in featured sections
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
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
                        <p className="text-sm text-muted-foreground">
                            Add tags to help customers find your product
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Enter a tag"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTag();
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
                        <FormDescription>
                            Keywords for better product discovery
                        </FormDescription>
                    </div>
                </div>

                {error && (
                    <div className="text-destructive bg-destructive/10 p-3 rounded-md">
                        {error}
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/products")}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} onClick={()=> onSubmit(form.getValues())}>
                        {isSubmitting ? "Creating..." : "Create Product"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
