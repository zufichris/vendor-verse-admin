import { EditBlogForm } from '@/components/blogs/edit-blog-form';
import { Blog } from '@/types/blog';
import { Api } from '@/utils/api';
import { notFound } from 'next/navigation';
import React from 'react'

interface Props{
    params: Promise<{id: string}>
}

export default async  function EditBlog({params}: Props) {
    const { id } = await params;
    
        const {data: blog} = await Api.get<Blog>(`/blogs/slug/${id}`);

        console.log(typeof blog?.jsonContent)
    
        if (!blog) {
            return notFound();
        }
        
  return (
    <main className="min-h-screen bg-background">
          {/* Header */}
          <div className="border-b border-border bg-card">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                <span className="text-balance">Edit Blog Post</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">Share your insights and stories with the world.</p>
            </div>
          </div>
    
          {/* Form */}
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <EditBlogForm blog={blog} />
          </div>
        </main>
  )
}
