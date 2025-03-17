import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// This would typically come from a database or CMS
const blogPosts = [
  {
    id: "nextjs-vs-react",
    title: "Next.js vs React: When to Use Each",
    excerpt: "A comprehensive comparison of Next.js and React, helping you decide which is best for your project.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2023-10-15",
    readTime: "5 min read",
    category: "Web Development",
    slug: "nextjs-vs-react",
  },
  {
    id: "typescript-best-practices",
    title: "TypeScript Best Practices for 2023",
    excerpt: "Learn the latest TypeScript best practices to write cleaner, more maintainable code.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2023-09-22",
    readTime: "7 min read",
    category: "TypeScript",
    slug: "typescript-best-practices",
  },
  {
    id: "responsive-design-tips",
    title: "10 Responsive Design Tips for Modern Websites",
    excerpt: "Discover essential responsive design techniques to ensure your website looks great on all devices.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2023-08-30",
    readTime: "6 min read",
    category: "CSS",
    slug: "responsive-design-tips",
  },
  {
    id: "state-management-react",
    title: "State Management in React: A 2023 Guide",
    excerpt: "Explore different state management solutions in React and learn when to use each one.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2023-08-15",
    readTime: "8 min read",
    category: "React",
    slug: "state-management-react",
  },
  {
    id: "api-design-best-practices",
    title: "RESTful API Design Best Practices",
    excerpt: "Learn how to design clean, efficient, and developer-friendly RESTful APIs.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2023-07-28",
    readTime: "6 min read",
    category: "Backend",
    slug: "api-design-best-practices",
  },
  {
    id: "web-performance-optimization",
    title: "Web Performance Optimization Techniques",
    excerpt: "Practical techniques to improve your website's loading speed and overall performance.",
    image: "/placeholder.svg?height=300&width=500",
    date: "2023-07-10",
    readTime: "7 min read",
    category: "Performance",
    slug: "web-performance-optimization",
  },
]

const categories = ["All", "Web Development", "TypeScript", "React", "CSS", "Backend", "Performance"]

export default function BlogPage() {
  return (
    <main className="flex-1 py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Blog</h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Thoughts, insights, and tutorials on web development, design, and technology.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-2/3">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search articles..." className="pl-10" />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {blogPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg"
                >
                  <div className="overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={500}
                      height={300}
                      className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="flex-grow p-6">
                    <Badge className="mb-2">{post.category}</Badge>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <div className="flex items-center mr-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/blog/${post.slug}`}>Read Article</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="sticky top-24">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={category === "All" ? "default" : "outline"}
                      className="cursor-pointer"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest articles and updates delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <Input placeholder="Your email address" type="email" />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

