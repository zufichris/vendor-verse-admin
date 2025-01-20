"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Star, TrendingUp, TrendingDown, Store, Mail, Phone, Globe, Edit, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { VendorsTableSkeleton } from "./vendors-skeleton"
import { BlockVendorModal } from "./block-vendor-modal"

const vendors = [
  {
    id: "VEN001",
    name: "Tech Gadgets Inc",
    logo: "/placeholder.svg?height=40&width=40",
    category: "Electronics",
    products: 145,
    revenue: "$156,789",
    rating: 4.8,
    status: "Active",
    growth: 15,
    contact: {
      name: "John Smith",
      email: "john@techgadgets.com",
      phone: "+1 234 567 890",
      website: "techgadgets.com",
    },
    joinDate: "2023-01-15",
  },
  {
    id: "VEN002",
    name: "Fashion Hub",
    logo: "/placeholder.svg?height=40&width=40",
    category: "Fashion",
    products: 98,
    revenue: "$89,432",
    rating: 4.6,
    status: "Active",
    growth: 8,
    contact: {
      name: "Sarah Johnson",
      email: "sarah@fashionhub.com",
      phone: "+1 234 567 891",
      website: "fashionhub.com",
    },
    joinDate: "2023-02-20",
  },
  {
    id: "VEN003",
    name: "Home Essentials",
    logo: "/placeholder.svg?height=40&width=40",
    category: "Home & Living",
    products: 76,
    revenue: "$67,890",
    rating: 4.7,
    status: "Active",
    growth: 12,
    contact: {
      name: "Mike Wilson",
      email: "mike@homeessentials.com",
      phone: "+1 234 567 892",
      website: "homeessentials.com",
    },
    joinDate: "2023-03-10",
  },
  {
    id: "VEN004",
    name: "Organic Foods",
    logo: "/placeholder.svg?height=40&width=40",
    category: "Food & Beverages",
    products: 65,
    revenue: "$45,678",
    rating: 4.9,
    status: "Under Review",
    growth: -5,
    contact: {
      name: "Lisa Brown",
      email: "lisa@organicfoods.com",
      phone: "+1 234 567 893",
      website: "organicfoods.com",
    },
    joinDate: "2023-04-05",
  },
  {
    id: "VEN005",
    name: "Sports Gear Pro",
    logo: "/placeholder.svg?height=40&width=40",
    category: "Sports",
    products: 54,
    revenue: "$34,567",
    rating: 4.5,
    status: "Inactive",
    growth: 20,
    contact: {
      name: "Tom Davis",
      email: "tom@sportsgear.com",
      phone: "+1 234 567 894",
      website: "sportsgear.com",
    },
    joinDate: "2023-05-15",
  },
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    case "under review":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    case "inactive":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
  }
}

export function VendorsList() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <VendorsTableSkeleton />
  }

  return (
    <Card>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden xl:table-cell">Contact</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={vendor.logo || "/placeholder.svg"}
                      alt={`${vendor.name} logo`}
                      className="h-10 w-10 rounded-lg border p-2"
                    />
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Since {new Date(vendor.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>{vendor.products}</TableCell>
                <TableCell>{vendor.revenue}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{vendor.rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <div
                      className={`ml-2 flex items-center gap-1 text-xs ${
                        vendor.growth > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {vendor.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(vendor.growth)}%
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(vendor.status)} whitespace-nowrap`} variant="secondary">
                    {vendor.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="flex items-center gap-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{vendor.contact.email}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{vendor.contact.phone}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a href={`https://${vendor.contact.website}`} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-4 w-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{vendor.contact.website}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Store className="mr-2 h-4 w-4" />
                        View Store
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <BlockVendorModal />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

