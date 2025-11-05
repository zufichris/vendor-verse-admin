import { BlogForm } from "@/components/blogs/blog-form"

export default function NewBlogPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            <span className="text-balance">Create New Blog Post</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">Share your insights and stories with the world.</p>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <BlogForm />
      </div>
    </main>
  )
}
