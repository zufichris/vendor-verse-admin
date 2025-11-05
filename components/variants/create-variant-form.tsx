"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CreateVariantDto, CreateVariantDtoSchema, SupportedSizes } from "@/lib/validations/product.validations"
import { DimensionsSection } from "@/components/variants/variant-dimension"
import { AttributesSection } from "@/components/variants/variant-attributes"
import { FileInput } from "@/components/ui/file-input"
import { Product } from "@/types/product.types"
import { getProducts } from "@/lib/actions/product.actions"
import { error } from "console"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/tiptap-ui-primitive/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Spinner } from "@/components/ui/spinner"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/tiptap-utils"
import { toast } from "sonner"
import { uploadFile } from "@/lib/actions/files-manager"
import { createVariant } from "@/lib/actions/variant.actions"
import slugify from "slugify"
import { MultiSelectOption, MultiSelectPopover } from "../ui/multi-select-popover"

const commonColors:Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  chocolate: "#7B3F00",
  espresso: "#4B3621",
  sand: "#C2B280",
  beige: "#F5F5DC",
  olive: "#808000",
  navy: "#000080",
  gray: "#808080",
  blush: "#DEB7A0",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#008000",
  yellow: "#FFFF00",
  pink: "#FFC0CB",
  brown: "#A52A2A",
}

interface VariantFormProps {
  product?: Product | null
}

interface MultiSelectFormFieldProps {
  label?: string
  description?: string
  options: MultiSelectOption[]
  value: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  maxItems?: number
  disabled?: boolean
}

function MultiSelectFormField({
  label,
  description,
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  maxItems,
  disabled,
}: MultiSelectFormFieldProps) {
  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <MultiSelectPopover
          options={options}
          selected={value}
          onSelect={onChange}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          maxItems={maxItems}
          disabled={disabled}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

export function VariantForm({  product }: VariantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedThumbnail, setSelectedThumbnail] = useState<File[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [selectedProduct, setSelectedProduct] = useState(product || null)
  const [productsList, setProductsList] = useState<Product[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [searching, setSearching] = useState(false)
  const [selectPdtOpen, setSelectPdtOpen] = useState(false)

  const sizeOptionsList = useMemo<MultiSelectOption[]>(()=>Object.values(SupportedSizes).map(itm => ({id: itm, label: itm, value: itm})), [])

  useEffect(()=>{
    (()=>{
      const timer = setTimeout(async () => {
      try {
        setSearching(true)
        const res = await getProducts({
          limit: 10,
          page: 1,
          search: searchInput,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        })

        setProductsList(res?.data?.data || [])
      } catch (e) {
        console.log(e)
      }finally{
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
    })()
  },[])

  const form = useForm<CreateVariantDto>({
    resolver: zodResolver(CreateVariantDtoSchema) as any,
    defaultValues: {
      productId: selectedProduct?.id || '',
      sku: selectedProduct?.sku || '',
      name: '',
      colorCode: '',
      price: selectedProduct?.price || 0,
      currency: selectedProduct?.currency || 'AED',
      discountPrice: 0,
      discountPercentage: selectedProduct?.discountPercentage || 0,
      discountFixedAmount: selectedProduct?.discountFixedAmount || 0,
      sizes: Object.values(SupportedSizes),
      attributes: {},
      stockQuantity: selectedProduct?.stockQuantity || 0,
      images: [{altText:'', url: ''}],
      thumbnail: {url: '', altText: ''},
      weight: selectedProduct?.weight || 0,
      weightUnit: selectedProduct?.weightUnit || 'kg',
      dimensions: selectedProduct?.dimensions || {
        height: 0,
        length: 0,
        unit: 'cm',
        width: 0
      },
    },
    mode: "onChange",
  })

  async function handleSubmit(data: CreateVariantDto) {
    setIsSubmitting(true)
    try {
      const {success} = CreateVariantDtoSchema.omit({thumbnail: true, images: true}).safeParse(data)

      if (!success) {
        form.trigger()
        return
      }

      if (!selectedThumbnail.length || !selectedImages.length) {
        toast.error("Please add thumbnail and images")
        return
      }

      const thmbForm = new FormData()
      const imagesForm = new FormData()

      const abtCtrl = new AbortController()

      thmbForm.append('file', selectedThumbnail[0], selectedThumbnail[0].name)

      selectedImages.map(img => {
        imagesForm.append('file', img, img.name)
      })

      const [thmRes, imagesRes] = await Promise.all([uploadFile(thmbForm, abtCtrl.signal) as Promise<string>, uploadFile(imagesForm, abtCtrl.signal, true) as Promise<string[]>])

      data.thumbnail = {
        url: thmRes,
        altText: data.name
      }

      data.images = imagesRes.map((img, i) => ({url: img, altText: `${data.name} ${i}`}))

      const res = await createVariant(data)

      if (!res.success) {
        toast.error(res.message || 'Unexpected server error')
        return
      }

      toast.success("Variant created successfully")
      form.reset()
      setSelectedImages([])
      setSelectedThumbnail([])
      setSelectedProduct(product||null)


    } catch (error) {
      console.error("Submit error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-0">
        {/* SECTION: PRODUCT */}
        <div className="px-6 md:px-8 py-8 border-b border-border/50">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Product Information</h2>
            <p className="text-sm text-muted-foreground mt-1">Identify the base product for this variant</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Product *</FormLabel>
                  <FormControl>
                    <Popover open={selectPdtOpen} onOpenChange={setSelectPdtOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={selectPdtOpen}
                          className="w-full justify-between"
                        >
                          {
                            selectedProduct ? selectedProduct?.name : 'Select a product'
                          }
                          <ChevronsUpDown />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search framework..." className="h-9" value={searchInput} onValueChange={setSearchInput} />
                          <CommandList>
                            <CommandEmpty>
                              {
                                !searching ? 'No products found' : (
                                  <div className="flex items-center">
                                    <Spinner /> Loading...
                                  </div>
                                )
                              }
                            </CommandEmpty>
                            <CommandGroup>
                              {productsList.map((pdt) => (
                                <CommandItem
                                  key={pdt.id}
                                  value={pdt.name}
                                  onSelect={(currentValue) => {
                                    setSelectedProduct(pdt)
                                    const vName = (form.getValues('name')||'').trim()
                                    const sku = slugify((selectedProduct?.sku || selectedProduct?.name || '') + (vName ? `-${vName}` : '')).toUpperCase()
                                    form.setValue('sku', sku);
                                    setSelectPdtOpen(false)
                                  }}
                                >
                                  {pdt.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      selectedProduct?.name === pdt.name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., PROD-SKU-001" {...field} />
                  </FormControl>
                  <FormDescription>Will be automatically uppercase</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION: VARIANT NAME */}
        <div className="px-6 md:px-8 py-8 border-b border-border/50">
          {/* <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Variant Name</h2>
            <p className="text-sm text-muted-foreground mt-1">Describe this specific product variant</p>
          </div> */}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Red" {...field} onChange={(e)=>{
                    field.onChange(e)
                    form.setValue('sku', slugify(`${selectedProduct?.sku || selectedProduct?.name||''}${e.target.value.trim() ? `-${e.target.value.trim()}` : ''}`).toUpperCase())
                    form.setValue('colorCode', commonColors[e.target.value.toLowerCase()] || '')
                  }} />
                </FormControl>
                <FormDescription>Examples: "Blue", "Black"</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="px-6 md:px-8 py-8 border-b border-border/50">

          <FormField
            control={form.control}
            name="colorCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant Color Code *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., #000000" {...field} />
                </FormControl>
                <FormDescription>Examples: "#000000", "#ffffff"</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SECTION: PRICING & STOCK */}
        <div className="px-6 md:px-8 py-8 border-b border-border/50">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Pricing & Stock</h2>
            <p className="text-sm text-muted-foreground mt-1">Set pricing and inventory for this variant</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>Price in selected currency</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" min="0" {...field} />
                    </FormControl>
                    <FormDescription>Available units in inventory</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION: DETAILS */}
        <div className="px-6 md:px-8 py-8 border-b border-border/50">
          {/* <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Details</h2>
            <p className="text-sm text-muted-foreground mt-1">Additional product specifications and attributes</p>
          </div> */}

          <div className="space-y-8">
            {/* Weight */}
            <div>
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormDescription>Weight in kilograms (kg)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dimensions */}
            <div className="pt-4 border-t border-border/50">
              <DimensionsSection form={form} />
            </div>

            {/* Size Attributes */}
            {
              typeof window !== 'undefined' && <div className="pt-4 border-t border-border/50">
              <FormField
                name="sizes"
                control={form.control}
                render={({field})=>(
                  <MultiSelectFormField
                    {...field}
                    options={sizeOptionsList}
                    description="Select Available variant sizes"
                    emptyMessage="Size not available"
                    label="Select Sizes"
                    maxItems={sizeOptionsList.length}
                    placeholder="Select variant sizes"
                    searchPlaceholder="Search variant size"
                  />
                )}
              />
            </div>
            }
          </div>
        </div>

        {/* SECTION: MEDIA */}
        <div className="px-6 md:px-8 py-8 border-b border-border/50">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Media</h2>
            <p className="text-sm text-muted-foreground mt-1">Upload thumbnail and product images</p>
          </div>

          <div className="space-y-8">
            {/* Thumbnail */}
            <div>
              <h3 className="text-base font-medium text-foreground mb-4">Thumbnail Image</h3>
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileInput maxFiles={1} value={selectedThumbnail} onFilesChange={setSelectedThumbnail} accept="image/*" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Images */}
            <div className="pt-4 border-t border-border/50">
              <h3 className="text-base font-medium text-foreground mb-4">Product Images</h3>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileInput maxFiles={30} value={selectedImages} onFilesChange={setSelectedImages} accept="image/*" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="px-6 md:px-8 py-8 bg-muted/30 border-t border-border/50 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => {
            form.reset()
            setSelectedImages([])
            setSelectedThumbnail([])
            setSelectedProduct(product||null)
          }} disabled={isSubmitting}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={()=> handleSubmit(form.getValues())} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isSubmitting ? <div className="flex items-center">
              <Spinner /> Creating Variant...
            </div> : "Create Variant"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
