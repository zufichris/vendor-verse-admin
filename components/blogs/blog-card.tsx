import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Ellipsis, Trash } from "lucide-react"
import { usePathname } from "next/navigation"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { Api } from "@/utils/api"
import { Blog } from "@/types/blog"

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
    const [isOpen, setIsOpen] =  useState(false);
    const [textInput, setTextInput] = useState("");
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
        setTextInput("");
    }

    const handleDelete = async () => {
        try {
            setSubmitDisabled(true);
            // Implement delete logic here, e.g., call API to delete blog
            try {
                await Api.delete(`/blogs/${blog.id}`)
                toggleModal();
            } catch (error) {
                console.log(error);

            }
            // Close modal after deletion
        } catch (error) {
            console.log(error)
        }finally{
            setSubmitDisabled(false);
        }
    }
  return (
    <>
        <Link href={`/blogs/${blog.slug}`}>
          <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 relative">
          {/* Options for Admin */}
            <div className="absolute top-0 right-0 z-10">
              <Button variant={'destructive'}>
                <Trash />
              </Button>
            </div>
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden bg-muted">
              <Image
                src={blog.mainImageUrl || "/placeholder.svg"}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <CardHeader className="pb-3">
              <div className="flex flex-wrap gap-2">
                {blog.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {blog.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{blog.tags.length - 2}
                  </Badge>
                )}
              </div>
              <h3 className="mt-3 line-clamp-2 text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                {blog.title}
              </h3>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Summary */}
              <p className="line-clamp-3 text-sm text-muted-foreground">{blog.summary}</p>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>{`${blog.author.firstName ?? ''} ${blog.author.lastName ?? ''}`.trim() || 'N/A'}</span>
                <time dateTime={new Date(blog.createdAt).toISOString()}>{formatDate(new Date(blog.createdAt))}</time>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Dialog for delete confirmation */}
        <Dialog open={isOpen} onOpenChange={toggleModal}>
        <DialogContent className="sm:max-w-[425px] bg-primary-foreground">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Type <i><b>DELETE</b></i> to confirm.</Label>
              <Input id="name-1" name="name" placeholder="Type DELETE to confirm deleting this blog." value={textInput} onChange={(e)=>setTextInput(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant='destructive' onClick={handleDelete} disabled={textInput.toUpperCase() !== "DELETE" || submitDisabled}>Delete</Button>
          </DialogFooter>
        </DialogContent>

        </Dialog>
    </>
  )
}
