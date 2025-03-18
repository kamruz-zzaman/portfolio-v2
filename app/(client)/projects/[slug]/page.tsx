import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// This would typically come from a database or CMS
const projects = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "A full-featured online shopping platform with payment integration",
    fullDescription: `
      This e-commerce platform provides a complete solution for online businesses. It features product listings, 
      shopping cart functionality, secure checkout with Stripe integration, user authentication, and order management.
      
      The frontend is built with React, providing a smooth and responsive user experience. The backend uses Node.js 
      with Express, and data is stored in MongoDB. The application is fully responsive and works seamlessly on 
      mobile devices.
      
      Key features include:
      - User authentication and profile management
      - Product search and filtering
      - Shopping cart and wishlist functionality
      - Secure payment processing with Stripe
      - Order tracking and history
      - Admin dashboard for product and order management
    `,
    image: "/placeholder.svg?height=600&width=1200",
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    github: "https://github.com/kamruz/ecommerce-platform",
    demo: "https://ecommerce-platform.example.com",
    slug: "ecommerce-platform",
  },
  {
    id: "task-management",
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates",
    fullDescription: `
      This task management application helps teams collaborate effectively by providing real-time updates on task 
      progress. Users can create projects, assign tasks, set deadlines, and track progress.
      
      Built with Next.js and TypeScript, the application offers a type-safe codebase that's easy to maintain. 
      Firebase is used for real-time database functionality and authentication, while Tailwind CSS provides 
      a clean and modern UI.
      
      Key features include:
      - Real-time task updates
      - Project and team management
      - Task assignment and deadline tracking
      - Progress visualization with charts
      - Email notifications for task updates
      - Mobile-responsive design
    `,
    image: "/placeholder.svg?height=600&width=1200",
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    tags: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
    github: "https://github.com/kamruz/task-management",
    demo: "https://task-management.example.com",
    slug: "task-management",
  },
  {
    id: "ai-content-generator",
    title: "AI Content Generator",
    description: "An AI-powered application that generates content based on user prompts",
    fullDescription: `
      This AI content generator leverages the power of OpenAI's API to create high-quality content based on user prompts. 
      Users can generate blog posts, social media content, product descriptions, and more with just a few clicks.
      
      The frontend is built with React, providing an intuitive interface for users to input their prompts and 
      customize the generated content. The backend uses Express to handle API requests, and PostgreSQL stores 
      user data and generated content.
      
      Key features include:
      - Content generation from simple prompts
      - Multiple content types and formats
      - Content editing and refinement
      - Content history and favorites
      - Export to various formats (Markdown, HTML, etc.)
      - User authentication and subscription management
    `,
    image: "/placeholder.svg?height=600&width=1200",
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    tags: ["React", "OpenAI API", "Express", "PostgreSQL"],
    github: "https://github.com/kamruz/ai-content-generator",
    demo: "https://ai-content-generator.example.com",
    slug: "ai-content-generator",
  },
]

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <main className="flex-1 py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/#projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <div className="md:col-span-2">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              width={1200}
              height={600}
              className="rounded-lg object-cover w-full"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Project Overview</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {project.fullDescription.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Project Gallery</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {project.gallery.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${project.title} screenshot ${index + 1}`}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

