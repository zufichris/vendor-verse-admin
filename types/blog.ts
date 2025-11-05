import { User } from "./user.types"

export type Blog = {
    id: string
    title: string
    slug: string
    mainImageUrl: string
    summary: string
    tags: string[]
    author: User
    createdAt: Date
    jsonContent?: any
    htmlContent: string
}