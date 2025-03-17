"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onUpload: (url: string) => void
  defaultImage?: string
}

export function ImageUpload({ onUpload, defaultImage }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(defaultImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      setImage(data.url)
      onUpload(data.url)
    } catch (error) {
      setError("Failed to upload image")
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setImage(null)
    onUpload("")
  }

  return (
    <div className="space-y-2">
      <Label>Image</Label>

      {image ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border">
          <Image src={image || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          <Button variant="destructive" size="icon" className="absolute right-2 top-2" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex w-full max-w-md flex-col items-center justify-center rounded-md border border-dashed p-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Drag and drop or click to upload</p>
            <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (max 5MB)</p>
          </div>
          <Input type="file" accept="image/*" className="mt-4 w-full" onChange={handleUpload} disabled={isUploading} />
          {isUploading && (
            <div className="mt-2 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-xs">Uploading...</p>
            </div>
          )}
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>
      )}
    </div>
  )
}

