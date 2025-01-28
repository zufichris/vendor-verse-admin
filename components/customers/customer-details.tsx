"use client"

import { format } from "date-fns"
import { CreditCard, Edit, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import React, { useState } from "react"
import { EditCustomerForm } from "./update-customer"
import { TUser } from "@/lib/types/user"
import { UserAvatar } from "../user-avatar"
interface CustomerDetailsProps {
    readonly customer: TUser
}


export default function CustomerDetails({ customer }: CustomerDetailsProps) {
    const [openEdit, setOpenEdit] = useState(false)
    return (
        <React.Fragment>
            <div className="container mx-auto py-10">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl  tracking-tight">{customer.firstName} #{customer.custId}</h1>
                        <p className="text-muted-foreground">View and manage customer information</p>
                    </div>
                    <Button onClick={() => setOpenEdit(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Customer
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>Basic information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4">
                            <UserAvatar size={"lg"} firstName={customer.firstName!} lastName={customer.lastName!} src={customer.profilePictureUrl?.url} />
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-semibold">
                                        {customer.firstName} {customer.lastName}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant={customer.isActive ? "default" : "secondary"}>
                                            {customer.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                        {customer.isEmailVerified && <Badge variant="outline">Verified</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Customer since {format(customer.createdAt!, "MMM yyyy")}
                                    </p>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Phone</p>
                                        <p className="text-sm text-muted-foreground">{customer.phoneNumber ?? "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Stats Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shopping Statistics</CardTitle>
                            <CardDescription>shopping activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Total Orders</p>
                                    <p className="text-2xl font-bold">{customer?.stats?.totalOrders ?? 0}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Total Spent</p>
                                    <p className="text-2xl font-bold">${customer?.stats?.totalSpent?.toLocaleString() ?? 0}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Lifetime Value</p>
                                    <Badge variant="secondary">{customer?.lifetimeValue ?? 0}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Favorite Shops</p>
                                    <div className="flex gap-2">
                                        {(customer?.stats?.favoriteVendors ?? []).map((v) => (
                                            <Badge key={v.vendorId} variant="outline">
                                                {v.vendorName}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="details" className="mt-6">
                    <TabsList>
                        <TabsTrigger value="details">Shipping Details</TabsTrigger>
                        <TabsTrigger value="billing">Payment Methods</TabsTrigger>
                        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Address Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start space-x-4">
                                    <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{customer.address?.street}</p>
                                        <p className="text-muted-foreground">
                                            {customer.address?.city}, {customer.address?.state} {customer.address?.postalCode}
                                        </p>
                                        <p className="text-muted-foreground">{customer.address?.country}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{customer.notes}</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="billing" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Methods</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* {customer.paymentMethods.map((method) => (
                                    <div key={method.id} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">
                                                    {method.type} ending in {method.last4}
                                                </p>
                                                <p className="text-sm text-muted-foreground">Expires {method.expiryDate}</p>
                                            </div>
                                        </div>
                                        {method.isDefault && <Badge variant="secondary">Default</Badge>}
                                    </div>
                                ))} */}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="wishlist" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Wishlist
                                    {/* ({customer.wishlist.totalItems} items)
                                     */}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Recently Added</p>
                                        {/* <div className="grid gap-2">
                                            {customer.wishlist.recentlyAdded.map((item) => (
                                                <div key={item} className="flex items-center justify-between">
                                                    <span className="text-sm">{item}</span>
                                                    <Button variant="ghost" size="sm">
                                                        View
                                                    </Button>
                                                </div>
                                            ))}
                                        </div> */}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>{" "}
            <EditCustomerForm customer={customer} open={openEdit} onOpenChange={(open) => setOpenEdit(open)} />
        </React.Fragment>
    )
}

