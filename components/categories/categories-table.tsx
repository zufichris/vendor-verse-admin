"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Edit, Eye, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Card } from "../ui/card";
import { PaginationResult } from "@/types/pagination.types";
import { ProductCategory } from "@/types/product.types";
import { formatDate } from "@/utils/date";
import Image from "next/image";
import {
  CreateCategoryModal,
  DeleteCategoryModal,
  EditCategoryModal,
  ViewCategoryModal,
} from "./modals";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/actions/category.actions";

interface CategoriesTableProps {
  categories: PaginationResult<ProductCategory>;
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const getParentCategoryName = (parentId?: string): string => {
    if (!parentId) return "-";
    const parent = categories.data.find((cat) => cat.id === parentId);
    return parent ? parent.name : "Unknown";
  };
  const handleCreateCategory = async (data: any) => {
    await createCategory(data);
    setCreateModalOpen(false);
  };
  const handleEditCategory = async (id: string, data: any) => {
    await updateCategory(id, data);
    setEditModalOpen(false);
  };
  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    setDeleteModalOpen(false);
  };
  const openViewModal = (category: ProductCategory) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
  };
  const openEditModal = (category: ProductCategory) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };
  const openDeleteModal = (category: ProductCategory) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };
  const switchToEdit = () => {
    setViewModalOpen(false);
    setEditModalOpen(true);
  };
  return (
    <div className="w-full">
      {/* Header with create button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Product Categories</h2>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-medium">Category</TableHead>
                <TableHead className="font-medium">Slug</TableHead>
                <TableHead className="font-medium">Parent Category</TableHead>
                <TableHead className="font-medium">Created</TableHead>
                <TableHead className="text-right font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.data.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                          <Image
                            src={category.image?.url || "/placeholder.svg"}
                            alt={category.image?.altText || category.slug}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {category.slug}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getParentCategoryName(category.parentId)}
                    </TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => openViewModal(category)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => openEditModal(category)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive"
                            onClick={() => openDeleteModal(category)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-3">
        {categories.data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-md p-6 bg-muted/10">
            No categories found
          </div>
        ) : (
          categories.data.map((category) => (
            <Card
              key={category.id}
              className="p-4 shadow-sm hover:shadow transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                  <Image
                    src={category.image?.url || "/placeholder.svg"}
                    alt={category.image?.altText || category.slug}
                    height={48}
                    width={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium truncate pr-2">
                      {category.name}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openViewModal(category)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openEditModal(category)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive"
                          onClick={() => openDeleteModal(category)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {category.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {category.description}
                    </div>
                  )}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slug:</span>
                      <Badge
                        variant="outline"
                        className="ml-2 font-mono text-xs"
                      >
                        {category.slug}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parent:</span>
                      <span>{getParentCategoryName(category.parentId)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{formatDate(category.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {categories.data.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <div>
            Showing {(categories.page - 1) * categories.limit + 1} to{" "}
            {Math.min(
              categories.page * categories.limit,
              categories.totalCount,
            )}{" "}
            of {categories.totalCount} categories
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!categories.hasPreviousPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!categories.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateCategoryModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateCategory}
        categories={categories.data.map((cat) => ({
          id: cat.id,
          name: cat.name,
        }))}
      />
      <ViewCategoryModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        category={selectedCategory}
        getParentCategoryName={getParentCategoryName}
        onEdit={switchToEdit}
      />
      <EditCategoryModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        category={selectedCategory}
        onSubmit={handleEditCategory}
        categories={categories.data.map((cat) => ({
          id: cat.id,
          name: cat.name,
        }))}
      />
      <DeleteCategoryModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        category={selectedCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}
