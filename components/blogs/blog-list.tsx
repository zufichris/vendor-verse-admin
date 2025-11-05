"use client"

import { useMemo } from "react"
import { BlogCard } from "./blog-card"
import { BlogSearch } from "./blog-search"
import { BlogPagination } from "./blog-pagination"
import { QueryResponse } from "@/utils/api"
import { Blog } from "@/types/blog"
import Link from "next/link"
import { Button } from "../ui/button"


interface BlogListProps extends QueryResponse<Blog> {}

export function BlogList({
    data,
    filterCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    limit,
    page,
    totalCount,
}: BlogListProps) {

    const filteredBlogs = useMemo(() => {
        // Implement filtering logic if needed
        return data
    }, [data])


  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="border-b border-border bg-card flex items-center justify-between w-full">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            <span className="text-balance">Blogs</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover the latest trends, style tips, and fashion inspiration.
          </p>
        </div>

        <Link href={'/blogs/new'}>
          <Button className="cursor-pointer">
            Create New Blog
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Search Filter*/}
        <div className="flex justify-center">
          <BlogSearch />
        </div>

        {/* Blog Grid */}
        <div className="mt-12">
          {filteredBlogs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">
                No blogs found with the search query. Try searching for something else.
              </p>
            </div>
          )}
        </div>

        {/* Results count + pagination  controls */}
        {filteredBlogs.length > 0 && (
          <>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Showing {filterCount} of {totalCount} articles
            </div>
            <BlogPagination
              currentPage={page}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
            />
          </>
        )}
      </div>
    </main>
  )
}
