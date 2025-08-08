"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Edit, Trash2, Eye, Search } from "lucide-react";
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
import { Pagination } from "@/components/ui/pagination";
import type { Banner } from "@/types/product.types";
import type { PaginationResult } from "@/types/pagination.types";
import { DeleteBannerModal } from "@/components/banners/delete-banner-modal";
import { useToast } from "@/hooks/use-toast";

interface BannersTableProps {
    paginatedBanners: PaginationResult<Banner>;
}

export function BannersTable({ paginatedBanners }: BannersTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
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
        router.push(`/admin/banners?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`/admin/banners?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Input
                            placeholder="Search banners..."
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
                </div>
                <div className="text-sm text-muted-foreground">
                    Showing {paginatedBanners.data.length} of{" "}
                    {paginatedBanners.filterCount} banners
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Preview</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Subtitle</TableHead>
                            <TableHead>CTA</TableHead>
                            <TableHead>Link</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedBanners.data.map((banner) => (
                            <TableRow key={banner.id}>
                                <TableCell>
                                    <div className="relative h-20 w-32 rounded-md overflow-hidden">
                                        <Image
                                            src={banner.image || "/placeholder.svg"}
                                            alt={banner.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="font-medium text-primary">
                                            {banner.title}
                                        </div>
                                        <div className="text-sm text-muted-foreground line-clamp-2">
                                            {banner.description}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{banner.subtitle}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{banner.cta}</Badge>
                                </TableCell>
                                <TableCell>
                                    <a
                                        href={banner.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {banner.link}
                                    </a>
                                </TableCell>
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
                                                <Link href={`/admin/banners/${banner.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/banners/${banner.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Banner
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => {
                                                    setSelectedBanner(banner);
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

            {paginatedBanners.data.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        No banners found matching your criteria.
                    </p>
                </div>
            )}

            <Pagination />

            <DeleteBannerModal
                banner={selectedBanner}
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
            />
        </div>
    );
}
