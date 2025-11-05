import {
    CreateProductCategoryDto,
    CreateProductCategoryDtoSchema,
    UpdateProductCategoryDto,
    UpdateProductCategoryDtoSchema,
} from "@/types/product.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ProductCategory } from "@/types/product.types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { ImageUpload } from "../shared/image-upload";
import { FileInput } from "../ui/file-input";
import { uploadFile } from "@/lib/actions/files-manager";
import { Spinner } from "../ui/spinner";

interface CreateCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateProductCategoryDto) => void;
    categories: {
        id: string;
        name: string;
    }[];
}

export function CreateCategoryModal({
    open,
    onOpenChange,
    onSubmit,
    categories,
}: CreateCategoryModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    const form = useForm<CreateProductCategoryDto>({
        resolver: zodResolver(CreateProductCategoryDtoSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            parentId: undefined,

        },
    });
    const handleSubmit = async (data: CreateProductCategoryDto) => {
        try {
            setIsSubmitting(true)
            if (selectedImage) {
               const formData = new FormData()
               formData.append('file', selectedImage, selectedImage.name)

               const url = await uploadFile(formData) as unknown as string;

               data.image = {
                ...(data?.image ||{}),
                url
               }
            }
            await onSubmit(data);
            form.reset();
        } catch (error) {
            console.log(error)
        }finally{
            setIsSubmitting(false)
            setSelectedImage(null)
        }
    };
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        form.setValue("slug", slug);
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>
                        Add a new product category to your store.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Category name"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleNameChange(e);
                                            }}
                                        />
                                    </FormControl>
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
                                        <Input {...field} placeholder="category-slug" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Brief description of the category"
                                            className="resize-none"
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <FileInput
                                accept="image/*"
                                maxFiles={1}
                                value={selectedImage ? [selectedImage] : []}
                                onFilesChange={(files)=> setSelectedImage(files[0])}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="image.altText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image Alt Text (optional)</FormLabel>
                                    <FormControl>
                                        <div className="grid gap-2">
                                          <Input
                                            id="alt-text"
                                            placeholder="Descriptive text for the image"
                                            {...field}
                                          />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="border-t pt-4 mt-2">
                            <h3 className="text-sm font-medium mb-2">
                                SEO Information (optional)
                            </h3>
                            <FormField
                                control={form.control}
                                name="seo.title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SEO Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="SEO title for this category"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="seo.description"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormLabel>SEO Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="SEO description for this category"
                                                className="resize-none"
                                                rows={2}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} onClick={()=> handleSubmit(form.getValues())}>
                                {
                                    isSubmitting ? <><Spinner /> Processing</> : 'Create Category'
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

interface DeleteCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: ProductCategory | null;
    onDelete: (id: string) => void;
}

export function DeleteCategoryModal({
    open,
    onOpenChange,
    category,
    onDelete,
}: DeleteCategoryModalProps) {
    if (!category) return null;
    const handleDelete = () => {
        onDelete(category.id);
        onOpenChange(false);
    };
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the category "{category.name}"? This
                        action cannot be undone.
                        {category.parentId && (
                            <div className="mt-2 text-destructive">
                                Warning: This will also affect any products associated with this
                                category.
                            </div>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

interface EditCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: ProductCategory | null;
    onSubmit: (id: string, data: UpdateProductCategoryDto) => void;
    categories: {
        id: string;
        name: string;
    }[];
}
export function EditCategoryModal({
    open,
    onOpenChange,
    category,
    onSubmit,
    categories,
}: EditCategoryModalProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<UpdateProductCategoryDto>({
        resolver: zodResolver(UpdateProductCategoryDtoSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            parentId: undefined,
            image: undefined,
            seo: {
                title: "",
                description: "",
            },
        },
    });
    useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                slug: category.slug,
                description: category.description || "",
                parentId: category.parentId,
                image: category.image,
                seo: category.seo,
            });
        }
    }, [category, form]);

    console.log(category)

    const handleSubmit = async (data: UpdateProductCategoryDto) => {
        if (category) {
            try {
                setIsSubmitting(true)
                if (selectedImage) {
                    const formData = new FormData()
                    formData.append('file', selectedImage, selectedImage.name)

                    const url = await uploadFile(formData) as unknown as string;

                    data.image = {
                        ...(data?.image || {}),
                        url
                    }
                }

                await onSubmit(category.id, data);
            } catch (error) {
                console.log(error)
            }finally{
                setIsSubmitting(false)
                setSelectedImage(null)
            }
        }
    };
    if (!category) return null;
    const availableParentCategories = categories.filter(
        (cat) => cat.id !== category.id,
    );
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Update the details for this product category.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Category name" />
                                    </FormControl>
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
                                        <Input {...field} placeholder="category-slug" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Brief description of the category"
                                            className="resize-none"
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Image (optional)</FormLabel>
                                        {
                                            !selectedImage && category.image?.url && <div><img src={category.image.url} alt={category.image?.altText || category.name}  /></div>
                                        }
                                    <FormControl>
                                        <FileInput
                                            value={selectedImage ? [selectedImage] : []}
                                            onFilesChange={(files)=> setSelectedImage(files[0])}
                                            accept="image/*"
                                            maxFiles={1}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="border-t pt-4 mt-2">
                            <h3 className="text-sm font-medium mb-2">
                                SEO Information (optional)
                            </h3>
                            <FormField
                                control={form.control}
                                name="seo.title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SEO Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="SEO title for this category"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="seo.description"
                                render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormLabel>SEO Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="SEO description for this category"
                                                className="resize-none"
                                                rows={2}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {
                                    isSubmitting ? <><Spinner /> Updating</> : "Save Changes"
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

interface ViewCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: ProductCategory | null;
    getParentCategoryName: (parentId?: string) => string;
    onEdit: () => void;
}
export function ViewCategoryModal({
    open,
    onOpenChange,
    category,
    getParentCategoryName,
    onEdit,
}: ViewCategoryModalProps) {
    if (!category) return null;
    const formatDate = (dateString?: string): string => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Category Details</DialogTitle>
                    <DialogDescription>
                        Viewing details for this product category.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    {category.image?.url && (
                        <div className="mx-auto w-full max-w-[200px] aspect-square relative rounded-md overflow-hidden border">
                            <Image
                                src={category.image.url || "/placeholder.svg"}
                                alt={category.image.altText || category.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div className="grid gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Name
                            </h3>
                            <p className="text-base">{category.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Slug
                            </h3>
                            <Badge variant="outline" className="mt-1 font-mono">
                                {category.slug}
                            </Badge>
                        </div>
                        {category.description && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Description
                                </h3>
                                <p className="text-sm mt-1">{category.description}</p>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Parent Category
                            </h3>
                            <p className="text-sm mt-1">
                                {getParentCategoryName(category.parentId)}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Created
                                </h3>
                                <p className="text-sm mt-1">{formatDate(category.createdAt)}</p>
                            </div>
                            {category.updatedAt && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </h3>
                                    <p className="text-sm mt-1">
                                        {formatDate(category.updatedAt)}
                                    </p>
                                </div>
                            )}
                        </div>
                        {category.seo && (
                            <div className="border-t pt-4 mt-2">
                                <h3 className="text-sm font-medium mb-2">SEO Information</h3>
                                {category.seo.title && (
                                    <div className="mb-2">
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            SEO Title
                                        </h4>
                                        <p className="text-sm">{category.seo.title}</p>
                                    </div>
                                )}
                                {category.seo.description && (
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">
                                            SEO Description
                                        </h4>
                                        <p className="text-sm">{category.seo.description}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button onClick={onEdit}>Edit Category</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
