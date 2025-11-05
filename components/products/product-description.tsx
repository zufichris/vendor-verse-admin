'use client'
import { getDefaultEditorConfig } from '@/lib/tiptap-utils'
import { generateHTML } from '@tiptap/react'
import React from 'react'

export default function ProductDescription({description}:{description: any}) {

    let html = ''

    try {
        const json = typeof description === 'string' ? JSON.parse(description) : String(description)

        html = generateHTML(json, getDefaultEditorConfig().extensions as any)
        
    } catch (error) {
        console.log(error)
    }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{
            __html: html
        }} />
  )
}
