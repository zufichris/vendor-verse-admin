import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVariant } from "@/lib/actions/variant.actions";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { VariantDetailsSkeleton } from "@/components/variants/variant-details-skeleton";

interface VariantPageProps {
    params: Promise<{ slug: string; variantId: string }>;
}

export async function generateMetadata({ params }: VariantPageProps) {
    const { variantId } = await params;
    const variant = await getVariant(variantId);
    if (!variant) {
        return {
            title: "Variant Not Found",
            description: "The requested variant does not exist.",
        };
    }
}

export default async function VariantPage({ params }: VariantPageProps) {
    const { slug, variantId } = await params;

    return (
        <div className="flex-1 space-y-4  pt-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/products/${slug}/variants`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Variants
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="outline" asChild>
                        <Link href={`/products/${slug}/variants/${variantId}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="outline">
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                    </Button>
                    <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <Suspense fallback={<VariantDetailsSkeleton />}>
                <VariantDetailsWrapper productSlug={slug} variantId={variantId} />
            </Suspense>
        </div>
    );
}

async function VariantDetailsWrapper({
    productSlug,
    variantId,
}: {
    productSlug: string;
    variantId: string;
}) {
    const [variantRes, productRes] = await Promise.all([
        getVariant(variantId),
        getProductBySlug(productSlug),
    ]);

    if (!variantRes.success || !productRes.success) {
        notFound();
    }
    const variant = variantRes.data;
    const product = productRes.data;

    const getStockBadge = () => {
        if (!variant.isInStock || variant.stockQuantity === 0) {
            return <Badge variant="destructive">Out of Stock</Badge>;
        }
        if (variant.stockQuantity < 5) {
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
                        {variant.name || "Unnamed Variant"}
                    </h1>
                    <Badge variant={variant.isInStock ? "default" : "secondary"}>
                        {variant.isInStock ? "Active" : "Inactive"}
                    </Badge>
                </div>
                <p className="text-muted-foreground">
                    Product: {product.name} • SKU: {variant.sku}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Variant Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Variant Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {variant.thumbnail && (
                                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary">
                                        <Image
                                            src={variant.thumbnail.url || "/placeholder.svg"}
                                            alt={
                                                variant.thumbnail.altText || variant.name || variant.sku
                                            }
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <Badge variant="secondary" className="text-xs">
                                                Thumbnail
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                                {variant.images?.slice(1).map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square rounded-lg overflow-hidden"
                                    >
                                        <Image
                                            src={image.url || "/placeholder.svg"}
                                            alt={
                                                image.altText ||
                                                `${variant.name || variant.sku} image ${index + 2}`
                                            }
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Variant Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Variant Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        SKU
                                    </p>
                                    <p className="font-mono">{variant.sku}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </p>
                                    <p>{variant.name || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Price
                                    </p>
                                    <p>
                                        ${variant.price.toFixed(2)} {variant.currency}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Stock Quantity
                                    </p>
                                    <p>{variant.stockQuantity} units</p>
                                </div>
                            </div>

                            {variant.attributes &&
                                Object.keys(variant.attributes).length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">
                                            Attributes
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(variant.attributes).map(
                                                ([key, value]) => (
                                                    <Badge key={key} variant="outline">
                                                        {key}: {value}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {variant.weight && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Weight
                                    </p>
                                    <p>
                                        {variant.weight} {variant.weightUnit || "kg"}
                                    </p>
                                </div>
                            )}

                            {variant.dimensions && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Dimensions
                                    </p>
                                    <p>
                                        {variant.dimensions.length} × {variant.dimensions.width} ×{" "}
                                        {variant.dimensions.height}{" "}
                                        {variant.dimensions.unit || "cm"}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
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
                                    ${variant.price.toFixed(2)} {variant.currency}
                                </p>
                                {variant.discountPercentage && (
                                    <p className="text-sm text-muted-foreground">
                                        {variant.discountPercentage}% discount applied
                                    </p>
                                )}
                                {variant.discountPrice && (
                                    <p className="text-sm text-success">
                                        Sale Price: ${variant.discountPrice.toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stock Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Stock Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Status</span>
                                {getStockBadge()}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Quantity</span>
                                <span className="font-medium">
                                    {variant.stockQuantity} units
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Available</span>
                                <span className="font-medium">
                                    {variant.isInStock ? "Yes" : "No"}
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
                                <p>{new Date(variant.createdAt).toLocaleDateString()}</p>
                            </div>
                            {variant.updatedAt && (
                                <div>
                                    <p className="text-muted-foreground">Last Updated</p>
                                    <p>{new Date(variant.updatedAt).toLocaleDateString()}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-muted-foreground">Variant ID</p>
                                <p className="font-mono text-xs">{variant.id}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Product ID</p>
                                <p className="font-mono text-xs">{variant.productId}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
