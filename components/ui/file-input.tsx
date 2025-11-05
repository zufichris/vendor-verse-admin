"use client"

import * as React from "react"
import { X, Upload, File, ImageIcon, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  onFilesChange?: (files: File[]) => void
  maxSize?: number // in bytes
  maxFiles?: number
  showPreview?: boolean
  value?: File[]
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      onFilesChange,
      maxSize = 5 * 1024 * 1024,
      maxFiles = 5,
      showPreview = true,
      value = [],
      accept,
      ...props
    },
    ref,
  ) => {
    const [files, setFiles] = React.useState<File[]>(value)
    const [dragActive, setDragActive] = React.useState(false)
    const [error, setError] = React.useState<string>("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    const validateFile = (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `File ${file.name} exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`
      }
      if (accept) {
        const acceptedTypes = accept.split(",").map((type) => type.trim())
        const fileExtension = `.${file.name.split(".").pop()}`
        const mimeType = file.type

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) {
            return fileExtension.toLowerCase() === type.toLowerCase()
          }
          if (type.endsWith("/*")) {
            return mimeType.startsWith(type.replace("/*", ""))
          }
          return mimeType === type
        })

        if (!isAccepted) {
          return `File ${file.name} type not accepted`
        }
      }
      return null
    }

    const handleFiles = (newFiles: FileList | null) => {
      if (!newFiles) return

      setError("")
      const fileArray = Array.from(newFiles)

      // Validate each file
      for (const file of fileArray) {
        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          return
        }
      }

      // Check max files limit
      if (maxFiles && files.length + fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      const updatedFiles = [...files, ...fileArray]
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
    }

    const removeFile = (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index)
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
      setError("")
    }

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFiles(e.dataTransfer.files)
    }

    const getFileIcon = (file: File) => {
      if (file.type.startsWith("image/")) {
        return <ImageIcon className="h-8 w-8 text-muted-foreground" />
      }
      if (file.type.includes("pdf") || file.type.includes("document")) {
        return <FileText className="h-8 w-8 text-muted-foreground" />
      }
      return <File className="h-8 w-8 text-muted-foreground" />
    }

    const getPreviewUrl = (file: File): string | null => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file)
      }
      return null
    }

    return (
      <div className={cn("w-full", className)}>
        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            props.disabled && "cursor-not-allowed opacity-50",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            accept={accept}
            multiple={maxFiles !== 1}
            {...props}
          />

          <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">Drag and drop files here, or click to browse</p>
          <p className="mb-4 text-xs text-muted-foreground">
            {accept ? `Accepted: ${accept}` : "All file types accepted"} • Max {(maxSize / 1024 / 1024).toFixed(0)}MB
            per file
            {maxFiles > 1 && ` • Up to ${maxFiles} files`}
          </p>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={props.disabled}
          >
            Select Files
          </Button>
        </div>

        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

        {showPreview && files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Selected Files ({files.length})</p>
            <div className="grid gap-2">
              {files.slice(0, 5).map((file, index) => { // show 5 files max
                const previewUrl = getPreviewUrl(file)
                return (
                  <div key={`${file.name}-${index}`} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                    {previewUrl ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt={file.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                        {getFileIcon(file)}
                      </div>
                    )}

                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove file</span>
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  },
)

FileInput.displayName = "FileInput"

export { FileInput }
