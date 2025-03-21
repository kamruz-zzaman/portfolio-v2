"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/dashboard/image-upload"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tag, setTag] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    fullDescription: "",
    image: "",
    gallery: [] as string[],
    tags: [] as string[],
    github: "",
    demo: "",
    featured: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title
    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
      }))
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }))
  }

  const handleGalleryImageUpload = (url: string) => {
    if (url) {
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, url],
      }))
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }))
      setTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create project")
      }

      toast({
        title: "Project created",
        description: "Your project has been created successfully",
      })

      router.push("/dashboard/projects")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">New Project</h2>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save Project"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="enter-project-slug"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the project"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  placeholder="Detailed description of the project"
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username/project"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo">Demo URL</Label>
                <Input
                  id="demo"
                  name="demo"
                  value={formData.demo}
                  onChange={handleChange}
                  placeholder="https://project-demo.example.com"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload onUpload={handleImageUpload} />
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              This image will be displayed as the main project image.
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {formData.gallery.map((image, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-md border">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Gallery image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <ImageUpload onUpload={handleGalleryImageUpload} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 rounded-full">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Add technology"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

