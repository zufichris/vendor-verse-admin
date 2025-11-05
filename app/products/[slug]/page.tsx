import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit,  Link2, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { ProductDetailsSkeleton } from "@/components/products/product-details-skeleton";
import ThumbnailUploader from "@/components/products/thumbnail-uploader";
import EditProductImages from "@/components/products/edit-product-images";
import ProductDescription from "@/components/products/product-description";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}


export async function generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params;
    const result = await getProductBySlug(slug);
    if (!result.success) {
        if (result.status === 404) {
            return {
                title: "Product Not Found",
                description: "The product you are looking for does not exist.",
            };
        }
        return {
            title: "Error",
            description: result.message || "An error occurred while fetching the product.",
        };
    }
    const product = result.data;
    return {
        title: product.name,
        description: product.seo?.description || "Product details",
        openGraph: {
            title: product.name,
            description: product.description || "Product details",
            images: [
                {
                    url: product.thumbnail.url || "/placeholder.svg",
                    alt: product.thumbnail.altText || product.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.seo?.description || "Product details",
            images: [product.thumbnail.url || "/placeholder.svg"],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/products">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Products
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="outline" asChild>
                        <Link href={`/products/${slug}/variants/new`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Variant
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`/products/${slug}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>


            <Suspense fallback={<ProductDetailsSkeleton />}>
                <ProductDetailsWrapper slug={slug} />
            </Suspense>
        </div>
    );
}

async function ProductDetailsWrapper({ slug }: { slug: string }) {
    const result = await getProductBySlug(slug);
    if (!result.success) {
        if (result.status === 404) {
            notFound();
        }
        return <div className="text-red-500">{result.message}</div>;
    }
    const product = result.data;

    const imagesToDisplay = product.images?.slice(0, 5);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-success text-success-foreground">Active</Badge>
                );
            case "inactive":
                return <Badge variant="secondary">Inactive</Badge>;
            case "draft":
                return <Badge variant="outline">Draft</Badge>;
            case "archived":
                return <Badge variant="secondary">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getStockBadge = () => {
        if (!product.isInStock || product.stockQuantity === 0) {
            return <Badge variant="destructive">Out of Stock</Badge>;
        }
        if (product.stockQuantity < 10) {
            return (
                <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>
            );
        }
        return (
            <Badge className="bg-success text-success-foreground">In Stock</Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center space-x-4 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">
                        {product.name}
                    </h1>
                    {product.featured && (
                        <Badge variant="outline" className="text-primary">
                            Featured
                        </Badge>
                    )}
                </div>
                <p className="text-muted-foreground"><ProductDescription description={product.description} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Images */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Product Images</CardTitle>
                                <EditProductImages product={product} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary group">
                                    <Image
                                        src={product.thumbnail.url || "/placeholder.svg"}
                                        alt={product.thumbnail.altText || product.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 left-2">
                                        <Badge variant="secondary" className="text-xs">
                                            Thumbnail
                                        </Badge>
                                    </div>

                                    <ThumbnailUploader className="absolute left-0 top-0 w-full h-full bg-muted-foreground opacity-90 flex items-center justify-center invisible group-hover:visible transition-all ease-in duration-100" productId={product.id} inStock={product.isInStock} />
                                </div>
                                {imagesToDisplay.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square rounded-lg overflow-hidden"
                                    >
                                        <Image
                                            src={image.url || "/placeholder.svg"}
                                            alt={
                                                image.altText || `${product.name} image ${index + 2}`
                                            }
                                            fill
                                            className="object-cover"
                                        />
                                        {
                                            index === (imagesToDisplay.length - 1) && product.images.length > imagesToDisplay.length && (
                                                <div className="absolute top-0 left-0 w-full h-full bg-accent-foreground opacity-40 hover:opacity-60 flex items-center justify-center text-primary-foreground font-bold text-xl">
                                                    <Plus /> {product.images.length - imagesToDisplay.length} More
                                                </div>
                                            )
                                        }
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    {product.variants?.length ? <Card>
                        <CardHeader>
                            <CardTitle>Product Variants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary">
                                    <Image
                                        src={product.thumbnail.url || "/placeholder.svg"}
                                        alt={product.thumbnail.altText || product.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 left-2">
                                        <Badge variant="secondary" className="text-xs">
                                            Thumbnail
                                        </Badge>
                                    </div>
                                </div>
                                {product.variants.map((variant, index) => (
                                    <div
                                        key={variant.id || variant.sku}
                                        className="relative aspect-square rounded-lg overflow-hidden"
                                    >
                                        <Image
                                            src={variant.thumbnail?.url || variant.thumbnail?.url || "/placeholder.svg"}
                                            alt={
                                                variant.thumbnail?.altText || `${variant.sku} image ${index + 2}`
                                            }
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {variant.name || `Variant ${variant.sku}`}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card> : null}

                    {/* Product Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        SKU
                                    </p>
                                    <p className="font-mono">{product.sku}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Category
                                    </p>
                                    <Link className="flex items-center text-primary" href={`/categories/${product.category.slug}`}><Link2 size={20} />{product.category.name}</Link>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Brand
                                    </p>
                                    <p>{product.brand || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Type
                                    </p>
                                    <p className="capitalize">{product.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Condition
                                    </p>
                                    <p className="capitalize">{product.condition || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Visibility
                                    </p>
                                    <p className="capitalize">{product.visibility}</p>
                                </div>
                            </div>

                            {product.tags && product.tags.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">
                                        Tags
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.map((tag) => (
                                            <Badge key={tag} variant="outline">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.weight && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Weight
                                    </p>
                                    <p>
                                        {product.weight} {product.weightUnit || "kg"}
                                    </p>
                                </div>
                            )}

                            {product.dimensions && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Dimensions
                                    </p>
                                    <p>
                                        {product.dimensions.length} × {product.dimensions.width} ×{" "}
                                        {product.dimensions.height}{" "}
                                        {product.dimensions.unit || "cm"}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Variants</CardTitle>
                                <CardDescription>
                                    This product has {product.variants.length} variant(s)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {product.variants.map((variant) => (
                                        <div key={variant.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">
                                                    {variant.name || `Variant ${variant.sku}`}
                                                </h4>
                                                <Badge
                                                    variant={
                                                        variant.isInStock ? "default" : "destructive"
                                                    }
                                                >
                                                    {variant.isInStock ? "In Stock" : "Out of Stock"}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">SKU</p>
                                                    <p className="font-mono">{variant.sku}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Price</p>
                                                    <p>
                                                        ${variant.price.toFixed(2)} {variant.currency}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Stock</p>
                                                    <p>{variant.stockQuantity} units</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Attributes</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {variant.attributes &&
                                                            Object.entries(variant.attributes).map(
                                                                ([key, value]) => (
                                                                    <Badge
                                                                        key={key}
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {key}: {value}
                                                                    </Badge>
                                                                ),
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-2xl font-bold text-primary">
                                    ${product.price.toFixed(2)} {product.currency}
                                </p>
                                {product.discountPercentage && (
                                    <p className="text-sm text-muted-foreground">
                                        {product.discountPercentage}% discount applied
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status & Stock */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status & Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Status</span>
                                {getStatusBadge(product.status)}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Stock Status</span>
                                {getStockBadge()}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Quantity</span>
                                <span className="font-medium">
                                    {product.stockQuantity} units
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Created</p>
                                <p>{new Date(product.createdAt).toLocaleDateString()}</p>
                            </div>
                            {product.updatedAt && (
                                <div>
                                    <p className="text-muted-foreground">Last Updated</p>
                                    <p>{new Date(product.updatedAt).toLocaleDateString()}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-muted-foreground">Product ID</p>
                                <p className="font-mono text-xs">{product.id}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    {product.seo && (
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                {product.seo.title && (
                                    <div>
                                        <p className="text-muted-foreground">SEO Title</p>
                                        <p>{product.seo.title}</p>
                                    </div>
                                )}
                                {product.seo.description && (
                                    <div>
                                        <p className="text-muted-foreground">SEO Description</p>
                                        <p>{product.seo.description}</p>
                                    </div>
                                )}
                                {product.seo.metaKeywords &&
                                    product.seo.metaKeywords.length > 0 && (
                                        <div>
                                            <p className="text-muted-foreground">Keywords</p>
                                            <div className="flex flex-wrap gap-1">
                                                {product.seo.metaKeywords.map((keyword) => (
                                                    <Badge
                                                        key={keyword}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {keyword}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
