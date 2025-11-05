"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateVariantDto } from "@/lib/validations/product.validations"

interface DimensionsSectionProps {
  form: UseFormReturn<CreateVariantDto>
}

export function DimensionsSection({ form }: DimensionsSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">Dimensions</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="dimensions.length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dimensions.width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Width</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dimensions.height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dimensions.unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                  <SelectItem value="ft">ft</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
