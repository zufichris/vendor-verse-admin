"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Loader2, X } from "lucide-react"
import { type CreateOrderDto, CreateOrderDtoSchema } from "@/types/order.dto"
import type { OrderItem } from "@/types/order.types"
import { createOrder } from "@/lib/actions/order.actions"
import { toast } from "sonner"

export function CreateOrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [items, setItems] = useState<OrderItem[]>([
    {
      productId: "",
      name: "",
      sku: "",
      price: 0,
      quantity: 1,
      discount: 0,
      total: 0,
    },
  ])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<CreateOrderDto>({
    resolver: zodResolver(CreateOrderDtoSchema),
    defaultValues: {
      items: items,
      tax: 0,
      shipping: 0,
      notes: "",
    },
  })

  const watchedTax = watch("tax", 0)
  const watchedShipping = watch("shipping", 0)

  const addItem = () => {
    const newItem: OrderItem = {
      productId: "",
      name: "",
      sku: "",
      price: 0,
      quantity: 1,
      discount: 0,
      total: 0,
    }
    const newItems = [...items, newItem]
    setItems(newItems)
    setValue("items", newItems)
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index)
      setItems(newItems)
      setValue("items", newItems)
    }
  }

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Calculate total for this item
    if (field === "price" || field === "quantity" || field === "discount") {
      const item = newItems[index]
      const subtotal = item.price * item.quantity
      item.total = subtotal - item.discount
    }

    setItems(newItems)
    setValue("items", newItems)
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateGrandTotal = () => {
    return calculateSubtotal() + watchedTax + watchedShipping
  }

  const onSubmit = async (data: CreateOrderDto) => {
    setIsSubmitting(true)
    try {
      await createOrder(data)
      toast.success("Order created successfully")
    } catch (error) {
      toast.error("Failed to create order")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Order Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Order Items</Label>
          <Button type="button" onClick={addItem} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label htmlFor={`item-${index}-name`}>Product Name</Label>
                    <Input
                      id={`item-${index}-name`}
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                      placeholder="Product name"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-${index}-sku`}>SKU</Label>
                    <Input
                      id={`item-${index}-sku`}
                      value={item.sku}
                      onChange={(e) => updateItem(index, "sku", e.target.value)}
                      placeholder="SKU"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-${index}-price`}>Price</Label>
                    <Input
                      id={`item-${index}-price`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`item-${index}-quantity`}>Quantity</Label>
                    <Input
                      id={`item-${index}-quantity`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Label>Total</Label>
                      <div className="text-lg font-semibold">${item.total.toFixed(2)}</div>
                    </div>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Shipping Address</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" {...register("shippingAddress.firstName")} placeholder="First name" />
            {errors.shippingAddress?.firstName && (
              <p className="text-sm text-red-600 mt-1">{errors.shippingAddress.firstName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...register("shippingAddress.lastName")} placeholder="Last name" />
            {errors.shippingAddress?.lastName && (
              <p className="text-sm text-red-600 mt-1">{errors.shippingAddress.lastName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("shippingAddress.email")} placeholder="email@example.com" />
            {errors.shippingAddress?.email && (
              <p className="text-sm text-red-600 mt-1">{errors.shippingAddress.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("shippingAddress.phone")} placeholder="Phone number" />
            {errors.shippingAddress?.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.shippingAddress.phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="street">Street Address</Label>
            <Input id="street" {...register("shippingAddress.street")} placeholder="Street address" />
            {errors.shippingAddress?.street && (
              <p className="text-sm text-red-600 mt-1">{errors.shippingAddress.street.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("shippingAddress.city")} placeholder="City" />
            {errors.shippingAddress?.city && (
              <p className="text-sm text-red-600 mt-1">{errors.shippingAddress.city.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register("shippingAddress.state")} placeholder="State" />
            {errors.shippingAddress?.state && (
              <p className="text-sm text-red-600 mt-1">{errors.shippingAddress.state.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input id="postalCode" {...register("shippingAddress.postalCode")} placeholder="Postal code" />
            {errors.shippingAddress?.postalCode && (
              <p className="text-sm text-red-600 mt-1">{errors.shippingAddress.postalCode.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("shippingAddress.country")} placeholder="Country" />
            {errors.shippingAddress?.country && (
              <p className="text-sm text-red-600 mt-1">{errors.shippingAddress.country.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tax">Tax Amount</Label>
              <Input
                id="tax"
                type="number"
                step="0.01"
                min="0"
                {...register("tax", { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="shipping">Shipping Cost</Label>
              <Input
                id="shipping"
                type="number"
                step="0.01"
                min="0"
                {...register("shipping", { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Order Notes</Label>
            <Textarea id="notes" {...register("notes")} placeholder="Special instructions or notes..." rows={3} />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${watchedTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${watchedShipping.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${calculateGrandTotal().toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Order"
          )}
        </Button>
      </div>
    </form>
  )
}
