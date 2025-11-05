"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Copy,
    Eye,
    ToggleLeft,
    ToggleRight,
    Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/types/product.types";
import type { PaginationResult } from "@/types/pagination.types";
import { DeleteProductModal } from "@/components/products/delete-product-modal";
import {
    toggleProductStatus,
    duplicateProduct,
} from "@/lib/actions/product.actions";
import { useToast } from "@/hooks/use-toast";
import { string } from "zod/v3";
import ProductDescription from "./product-description";

interface ProductsTableProps {
    paginatedProducts: PaginationResult<Product>;
}

export function ProductsTable({ paginatedProducts }: ProductsTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
            params.set("search", searchTerm);
        } else {
            params.delete("search");
        }
        params.set("page", "1");
        router.push(`/products?${params.toString()}`);
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status)
        const params = new URLSearchParams(searchParams.toString());
        if (status !== "all") {
            params.set("status", status);
        } else {
            params.delete("status");
        }
        params.set("page", "1");
        router.push(`/products?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`/products?${params.toString()}`);
    };

    const handleToggleStatus = async (product: Product) => {
        const newStatus = product.status === "active" ? "inactive" : "active";
        const result = await toggleProductStatus(product.id, newStatus);

        if (result.success) {
            toast({
                title: "Status Updated",
                description: `Product ${product.name} is now ${newStatus}`,
            });
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: result.error || "Failed to update product status",
                variant: "destructive",
            });
        }
    };

    const handleDuplicate = async (product: Product) => {
        const result = await duplicateProduct(product.id);

        if (result.success) {
            toast({
                title: "Product Duplicated",
                description: `${product.name} has been duplicated successfully`,
            });
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: result.error || "Failed to duplicate product",
                variant: "destructive",
            });
        }
    };

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

    const getStockBadge = (product: Product) => {
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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            className="w-64 pr-10"
                        />
                        <Button
                            size="sm"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={handleSearch}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    <Select value={statusFilter} onValueChange={handleStatusFilter}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                    Showing {paginatedProducts.data.length} of{" "}
                    {paginatedProducts.filterCount} products
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedProducts.data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                        <Image
                                            src={product.thumbnail.url || "/placeholder.svg"}
                                            alt={product.thumbnail.altText || product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="space-y-1"
                                    >
                                        <div className="font-medium text-primary">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground line-clamp-2">
                                            <ProductDescription description={product.description} />
                                        </div>
                                        {product.featured && (
                                            <Badge variant="outline" className="text-xs">
                                                Featured
                                            </Badge>
                                        )}
                                    </Link>
                                </TableCell>
                                <TableCell className="font-mono text-sm">
                                    {product.sku}
                                </TableCell>
                                <TableCell>{product.category.name}</TableCell>
                                <TableCell>
                                    <div className="font-medium">
                                        ${product.price.toFixed(2)} {product.currency}
                                    </div>
                                    {product.discountPercentage && (
                                        <div className="text-sm text-muted-foreground">
                                            {product.discountPercentage}% off
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium">
                                            {product.stockQuantity} units
                                        </div>
                                        {getStockBadge(product)}
                                    </div>
                                </TableCell>
                                <TableCell>{getStatusBadge(product.status)}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/products/${product.slug}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/products/${product.slug}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Product
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleToggleStatus(product)}
                                            >
                                                {product.status === "active" ? (
                                                    <>
                                                        <ToggleLeft className="mr-2 h-4 w-4" />
                                                        Deactivate
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleRight className="mr-2 h-4 w-4" />
                                                        Activate
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDuplicate(product)}
                                            >
                                                <Copy className="mr-2 h-4 w-4" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setDeleteModalOpen(true);
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {paginatedProducts.data.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        No products found matching your criteria.
                    </p>
                </div>
            )}
            <DeleteProductModal
                product={selectedProduct}
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
            />
        </div>
    );
}
