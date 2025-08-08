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
import { useToast } from "@/hooks/use-toast";
import {
    type CreateProductDto,
    CreateProductDtoSchema,
} from "@/types/product.dto";
import type { ProductCategory } from "@/types/product.types";
import { createProduct } from "@/lib/actions/product.actions";

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
    const { toast } = useToast();

    const form = useForm<CreateProductDto>({
        resolver: zodResolver(CreateProductDtoSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            currency: "USD",
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

    // Validate file type and size
    const validateFile = (file: File): string | null => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            return 'Please select a valid image file (JPEG, PNG, GIF, or WebP)';
        }

        if (file.size > maxSize) {
            return 'File size must be less than 5MB';
        }

        return null;
    };

    const handleImageUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const validFiles: File[] = [];
        const errors: string[] = [];

        Array.from(files).forEach(file => {
            const error = validateFile(file);
            if (error) {
                errors.push(`${file.name}: ${error}`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            toast({
                title: "Upload Error",
                description: errors.join('\n'),
                variant: "destructive",
            });
        }

        if (validFiles.length > 0) {
            const newFiles = [...imageFiles, ...validFiles];
            setImageFiles(newFiles);

            const imageObjects = newFiles.map((file) => ({
                url: URL.createObjectURL(file),
                altText: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            }));

            form.setValue("images", imageObjects);
        }

        // Reset the input
        if (imagesInputRef.current) {
            imagesInputRef.current.value = '';
        }
    };

    const handleThumbnailUpload = (file: File) => {
        const error = validateFile(file);
        if (error) {
            toast({
                title: "Upload Error",
                description: error,
                variant: "destructive",
            });
            return;
        }

        setThumbnailFile(file);
        form.setValue("thumbnail", {
            url: URL.createObjectURL(file),
            altText: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        });

        // Reset the input
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
    };

    const removeThumbnail = () => {
        if (thumbnailFile) {
            URL.revokeObjectURL(form.getValues("thumbnail").url);
        }
        setThumbnailFile(null);
        form.setValue("thumbnail", { url: "", altText: "" });
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const currentImages = form.getValues("images");
        if (currentImages[index]?.url) {
            URL.revokeObjectURL(currentImages[index].url);
        }

        const newFiles = imageFiles.filter((_, i) => i !== index);
        setImageFiles(newFiles);

        const imageObjects = newFiles.map((file) => ({
            url: URL.createObjectURL(file),
            altText: file.name.replace(/\.[^/.]+$/, ""),
        }));

        form.setValue("images", imageObjects);
    };

    const onSubmit = async (data: CreateProductDto) => {
        if (!thumbnailFile) {
            toast({
                title: "Validation Error",
                description: "Please upload a thumbnail image",
                variant: "destructive",
            });
            return;
        }

        if (imageFiles.length === 0) {
            toast({
                title: "Validation Error",
                description: "Please upload at least one product image",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const result = await createProduct(data);

            if (result.success) {
                toast({
                    title: "Product Created",
                    description: "Your product has been created successfully.",
                });

                imageFiles.forEach(file => {
                    const url = URL.createObjectURL(file);
                    URL.revokeObjectURL(url);
                });
                if (thumbnailFile) {
                    URL.revokeObjectURL(URL.createObjectURL(thumbnailFile));
                }

                router.push(`/products/${result.data.slug}`);
            } else {
                setError(result.message);
                toast({
                    title: "Error",
                    description: result.message || "Failed to create product",
                    variant: "destructive",
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
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
                                    <Textarea
                                        placeholder="Describe your product in detail..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
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
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="GBP">GBP</SelectItem>
                                            <SelectItem value="CAD">CAD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Three-letter currency code (e.g., USD, EUR)
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
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                {thumbnailFile ? (
                                    <div className="space-y-2">
                                        <img
                                            src={URL.createObjectURL(thumbnailFile)}
                                            alt="Thumbnail preview"
                                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {thumbnailFile.name}
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={removeThumbnail}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                        <div>
                                            <Button type="button" variant="outline" asChild>
                                                <label
                                                    htmlFor="thumbnail-upload"
                                                    className="cursor-pointer"
                                                >
                                                    Upload Thumbnail
                                                </label>
                                            </Button>
                                            <input
                                                ref={thumbnailInputRef}
                                                id="thumbnail-upload"
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif,image/webp"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleThumbnailUpload(file);
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Main product image used in listings
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <FormLabel>Additional Images *</FormLabel>
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
                                            ref={imagesInputRef}
                                            id="images-upload"
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(e.target.files)}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Product images (at least one required)
                                    </p>
                                </div>
                            </div>

                            {imageFiles.length > 0 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {imageFiles.map((file, index) => (
                                        <div key={`${file.name}-${index}`} className="relative">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Product image ${index + 1}`}
                                                className="h-20 w-20 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                                                onClick={() => removeImage(index)}
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
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Product"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
