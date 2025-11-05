"use client"

import type { UseFormReturn } from "react-hook-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateVariantDto } from "@/lib/validations/product.validations"

interface AttributesSectionProps {
  form: UseFormReturn<CreateVariantDto>
}

export function AttributesSection({ form }: AttributesSectionProps) {
  const [newKey, setNewKey] = useState("")
  const [newValue, setNewValue] = useState("")

  const attributes = (form.watch("attributes") || {}) as { [key: string]: string }

  const handleAddAttribute = () => {
    if (newKey.trim() && newValue.trim()) {
      const updated = {
        ...attributes,
        [newKey]: newValue,
      }
      form.setValue("attributes", updated)
      setNewKey("")
      setNewValue("")
    }
  }

  const handleRemoveAttribute = (key: string) => {
    const updated = { ...attributes }
    delete updated[key]
    form.setValue("attributes", updated)
  }

  const handleUpdateAttribute = (oldKey: string, newKey: string, value: string) => {
    const updated = { ...attributes }
    delete updated[oldKey]
    updated[newKey] = value
    form.setValue("attributes", updated)
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">Attributes</h3>

      <div className="space-y-3 mb-4">
        {Object.entries(attributes).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <Input
              placeholder="Attribute name"
              value={key}
              onChange={(e) => handleUpdateAttribute(key, e.target.value, value)}
              className="flex-1"
            />
            <Input
              placeholder="Attribute value"
              value={value}
              onChange={(e) => handleUpdateAttribute(key, key, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRemoveAttribute(key)}
              className="text-destructive hover:bg-destructive/10"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="e.g., Color"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="e.g., Red"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddAttribute}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Add
        </Button>
      </div>
    </div>
  )
}
