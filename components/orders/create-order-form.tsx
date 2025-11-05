"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Loader2, X, ChevronsUpDown, FolderOpen, Check, Copy, BadgeCheck, Share, Share2 } from "lucide-react"
import { type CreateOrderDto, CreateOrderDtoSchema } from "@/types/order.dto"
import type { OrderItem } from "@/types/order.types"
import { createOrder } from "@/lib/actions/order.actions"
import { toast } from "sonner"
import { Product } from "@/types/product.types"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Spinner } from "../ui/spinner"
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "../ui/item"
import { cn } from "@/lib/utils"
import { getProducts } from "@/lib/actions/product.actions"
import { User } from "@/types/user.types"
import { getUsers } from "@/lib/actions/user.actions"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"

interface Props{
  defaultProducts: Product[],
  defaultUsers?: User[]
}

export function CreateOrderForm({defaultProducts, defaultUsers = []}:Props) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openCommand, setOpenCommand] = useState(-1)
  const [openUser, setOpenUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [items, setItems] = useState<OrderItem[]>([
    {
      productId: "",
      name: "",
      sku: "",
      price: 0,
      quantity: 1,
      discount: 0,
      total: 0,
      imageUrl: ''
    },
  ])

  const [paymentUrl, setPaymentUrl] = useState('')
  const [showPaymentUrl, setShowPaymentUrl] = useState(false)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<CreateOrderDto>({
    resolver: zodResolver(CreateOrderDtoSchema) as any,
    defaultValues: {
      items: items,
      tax: 0,
      shipping: 0,
      notes: "",
      billingAddress: {},
      shippingAddress:{},
      userId: ''
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
      imageUrl: ''
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
      item.total = subtotal - (item.discount||0)
    }

    setItems(newItems)
    setValue("items", newItems)
  }

  const handleSelectProduct = (pdt:Product, index:number)=>{
    let found = items.find(itm => itm.productId === pdt.id)

    if (!found) {
      found = {
        discount: 0,
        name: pdt.name,
        price: pdt.price,
        productId: pdt.id,
        quantity: 0,
        sku: pdt.sku,
        total: 0,
        variantId: pdt.variantIds[0],
        imageUrl: pdt.thumbnail.url || pdt.images[0]?.url || ''
      }
    }

    found.quantity +=1;
    found.total = found.quantity * found.price;

    let foundIndex = items.findIndex(itm => itm.name === pdt.name);

    foundIndex = foundIndex < 0 ? index : foundIndex;

    const newItems = [...items.filter(itm => itm.productId !== found.productId)];
    newItems[foundIndex] = found;

    setItems(newItems)
    setOpenCommand(-1)
  }

  const onSelectUser = (usr:User)=>{
    setSelectedUser(usr)
    setValue('userId', usr.id)
    
    // set billing and shipping default information that may be available
    const shippingAddress = getValues('shippingAddress')
    const billingAddress = getValues('billingAddress')

    setValue('billingAddress', {
      city: billingAddress?.city || '',
      country: billingAddress?.country || '',
      email: billingAddress?.email || usr.email,
      firstName: billingAddress?.firstName || usr.firstName,
      lastName: billingAddress?.lastName || usr.lastName,
      phone: billingAddress?.phone || usr.phone || '',
      postalCode: billingAddress?.postalCode || '',
      state: billingAddress?.state || '',
      street: billingAddress?.street || ''
    })
    
    setValue('shippingAddress', {
      city: shippingAddress?.city || '',
      country: shippingAddress?.country || '',
      email: shippingAddress?.email || usr.email,
      firstName: shippingAddress?.firstName || usr.firstName,
      lastName: shippingAddress?.lastName || usr.lastName,
      phone: shippingAddress?.phone || usr.phone || '',
      postalCode: shippingAddress?.postalCode || '',
      state: shippingAddress?.state || '',
      street: shippingAddress?.street || ''
    })
    
    // Close popover                          
    setOpenUser(false)
  }

  const onCreateOrderModalClosed = (state:boolean)=>{
    setShowPaymentUrl(state);
    if (!state) {
      router.back()
    }
  }

  const handleCopy = (close?: boolean)=> {
    navigator.clipboard.writeText(paymentUrl)
    setCopied(true)
    if (close) {
      router.back()
    }

    setTimeout(() => {
      setCopied(false)
    }, 3000);
  }

  const handleShare = ()=>{
    if (navigator.canShare({
      text: paymentUrl
    })) {
      
        navigator.share({
          text: paymentUrl
        })
    }else{
      console.log('browser does not support share')
      navigator.clipboard.writeText(paymentUrl)
    }
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
      const dto:CreateOrderDto = {
        ...data,
        items: items.filter(itm => itm.productId),
        userId: selectedUser?.id
      }
      const result = await createOrder(dto)
      if (result?.success) {
        toast.success("Order created successfully")
        setPaymentUrl(result.data.paymentLink)
        setShowPaymentUrl(true)
      }else{
        toast.error("Unexpected error. Please check your form")
      }
    } catch (error) {
      toast.error("Failed to create order")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
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
                      <Popover open={openCommand === index} onOpenChange={() => setOpenCommand(index)}>
                        <PopoverTrigger asChild className="w-full border-2 justify-start">
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCommand === index}
                            // className="w-[200px] justify-between"
                          >
                            {item?.name
                              ? item?.name
                              : "Select product..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <SearchProductsCommand products={defaultProducts} onSelect={(pdt)=>{
                            handleSelectProduct(pdt, index)
                          }} />
                        </PopoverContent>
                      </Popover>
                      
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

        {/* User */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">User</Label>
          <Popover open={openUser} onOpenChange={setOpenUser}>
                        <PopoverTrigger asChild className="w-full border-2 justify-start">
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openUser}
                            // className="w-[200px] justify-between"
                          >
                            {selectedUser
                              ? `${selectedUser?.firstName||''} ${selectedUser?.lastName}`.trim() || 'No Name'
                              : "Select user (leave empty for anonymous order)..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <SearchUsersCommand users={defaultUsers} onSelect={onSelectUser} />
                        </PopoverContent>
                      </Popover>
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

        {/* Billing Address */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Billing Address</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("billingAddress.firstName")} placeholder="First name" />
              {errors.billingAddress?.firstName && (
                <p className="text-sm text-red-600 mt-1">{errors.billingAddress.firstName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("billingAddress.lastName")} placeholder="Last name" />
              {errors.billingAddress?.lastName && (
                <p className="text-sm text-red-600 mt-1">{errors.billingAddress.lastName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("billingAddress.email")} placeholder="email@example.com" />
              {errors.billingAddress?.email && (
                <p className="text-sm text-red-600 mt-1">{errors.billingAddress.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("billingAddress.phone")} placeholder="Phone number" />
              {errors.billingAddress?.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.billingAddress.phone.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" {...register("billingAddress.street")} placeholder="Street address" />
              {errors.billingAddress?.street && (
                <p className="text-sm text-red-600 mt-1">{errors.billingAddress.street.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("billingAddress.city")} placeholder="City" />
              {errors.billingAddress?.city && (
                <p className="text-sm text-red-600 mt-1">{errors.billingAddress.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("billingAddress.state")} placeholder="State" />
              {errors.billingAddress?.state && (
                <p className="text-sm text-red-600 mt-1">{errors.billingAddress.state.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" {...register("billingAddress.postalCode")} placeholder="Postal code" />
              {errors.billingAddress?.postalCode && (
                <p className="text-sm text-red-600 mt-1">{errors.billingAddress.postalCode.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("billingAddress.country")} placeholder="Country" />
              {errors.billingAddress?.country && (
                <p className="text-sm text-red-600 mt-1">{errors.billingAddress.country.message}</p>
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
          <Button type="button" variant="outline" onClick={()=> router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={()=> onSubmit(getValues())}>
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

      <Dialog open={showPaymentUrl} onOpenChange={onCreateOrderModalClosed}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e)=>e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Order Created Successfully</DialogTitle>
            <DialogDescription>
              Copy and share payment link with client
            </DialogDescription>
          </DialogHeader>
          <Item variant={'outline'}>
            <ItemMedia>
              <BadgeCheck color="green" size={18} />
            </ItemMedia>
            <ItemContent>
            <ItemTitle className="text-ellipsis line-clamp-1">{paymentUrl.slice(0, 35)}...</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button variant={'outline'} size={'sm'} onClick={()=>handleCopy()} className="cursor-pointer">
                <Copy className={ copied ? 'text-green-400' : ''}/>
              </Button>
            </ItemActions>
          </Item>

          <DialogFooter>
            <Button onClick={()=> handleCopy(true)} className="border border-muted-foreground bg-transparent text-primary hover:bg-transparent cursor-pointer flex items-center">
              <Copy/> Copy And Close
            </Button>
            <Button onClick={handleShare} className="border border-muted-foreground bg-transparent text-primary hover:bg-transparent cursor-pointer flex items-center">
              <Share2 /> Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


function SearchProductsCommand({products, onSelect}: {products: Product[], onSelect?: (product:Product)=>void}){
  const [list, setList] = useState(products)

  const [searchInput, setSearchInput] = useState('')
  const [searching, setSearching] = useState(false)

  const fetchProducts = async()=>{
    setSearching(true)
    try {
      const res = await getProducts({
        filters: {search: searchInput}
      })
      setList(res.data?.data || [])
    } catch (error) {
      console.log(error)
    }finally{
      setSearching(false)
    }
  }

  useEffect(()=>{
    const timer = setTimeout(async () => {
      await fetchProducts()
    }, 300)

    return () => clearTimeout(timer)
  },[searchInput])

  

  return (
    <Command>
      <CommandInput placeholder="Search product..." className="h-9" onValueChange={(search)=>{
        setSearchInput(search)
      }} value={searchInput} />
      <CommandList>
        <CommandEmpty>{searching ? (
          <Item>
          <ItemMedia><Spinner /></ItemMedia>
          <ItemContent>Searching</ItemContent>
          <ItemActions>
            <Button onClick={()=> setSearchInput('')}>Clear</Button>
          </ItemActions>
        </Item>
      ) : (
        <Item>
          <ItemMedia>
            <FolderOpen className="size-5"/>
          </ItemMedia>
          <ItemContent>
            No products found
          </ItemContent>
          {
            searchInput.trim().length ? (
              <ItemActions>
                <Button onClick={()=> setSearchInput('')}>Clear</Button>
              </ItemActions>
            ) : null
          }
        </Item>
      )}</CommandEmpty>
        <CommandGroup>
          {
            list.map(itm =>(
              <CommandItem
              key={itm.id}
              value={itm.name}
              onSelect={()=>{
                onSelect?.(itm)
              }}
                
              >
                {itm.name}
              </CommandItem>
            ))
          }

        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function SearchUsersCommand({users, onSelect}: {users: User[], onSelect?: (user:User)=>void}){
  const [list, setList] = useState(users)

  const [searchInput, setSearchInput] = useState('')
  const [searching, setSearching] = useState(false)

  const fetchUsers = async()=>{
    setSearching(true)
    try {
      const res = await getUsers(1,10,searchInput)
      setList(res.data?.data || [])
    } catch (error) {
      console.log(error)
    }finally{
      setSearching(false)
    }
  }

  useEffect(()=>{
    const timer = setTimeout(async () => {
      await fetchUsers()
    }, 300)

    return () => clearTimeout(timer)
  },[searchInput])

  

  return (
    <Command>
      <CommandInput placeholder="Search user..." className="h-9" onValueChange={(search)=>{
        setSearchInput(search)
      }} value={searchInput} />
      <CommandList>
        <CommandEmpty>{searching ? (
          <Item>
          <ItemMedia><Spinner /></ItemMedia>
          <ItemContent>Searching</ItemContent>
          <ItemActions>
            <Button onClick={()=> setSearchInput('')}>Clear</Button>
          </ItemActions>
        </Item>
      ) : (
        <Item>
          <ItemMedia>
            <FolderOpen className="size-5"/>
          </ItemMedia>
          <ItemContent>
            No users found
          </ItemContent>
          {
            searchInput.trim().length ? (
              <ItemActions>
                <Button onClick={()=> setSearchInput('')}>Clear</Button>
              </ItemActions>
            ) : null
          }
        </Item>
      )}</CommandEmpty>
        <CommandGroup>
          {
            list.map(itm =>(
              <CommandItem
              key={itm.id}
              value={itm.firstName}
              onSelect={()=>{
                onSelect?.(itm)
              }}
                
              >
                {`${itm?.firstName||''} ${itm?.lastName || ''}`.trim() || 'No Name...'}
              </CommandItem>
            ))
          }

        </CommandGroup>
      </CommandList>
    </Command>
  )
}


