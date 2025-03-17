"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import BlogComments from "@/components/blog/blog-comments"
import { PostActions } from "@/components/blog/post-actions"
import { formatDistanceToNow } from "date-fns"

interface Author {
  _id: string
  name: string
  image: string
}

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  author: Author
  readTime: string
  likes: number
  dislikes: number
  shares: number
  views: number
  userLiked?: boolean
  userDisliked?: boolean
  createdAt: string
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const commentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchPost()
  }, [params.slug])

  const fetchPost = async () => {
    try {
      // Fetch post by slug
      const response = await fetch(`/api/posts?slug=${params.slug}`)

      if (!response.ok) {
        throw new Error("Failed to fetch post")
      }

      const data = await response.json()

      if (data.posts.length === 0) {
        router.push("/blog")
        return
      }

      setPost(data.posts[0])

      // Fetch related posts
      const relatedResponse = await fetch(`/api/posts?category=${data.posts[0].category}&limit=2`)

      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json()
        setRelatedPosts(relatedData.posts.filter((p: Post) => p._id !== data.posts[0]._id).slice(0, 2))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format markdown-like content to HTML
  const formatContent = (content: string) => {
    const lines = content.trim().split("\n")
    let html = ""

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line.startsWith("# ")) {
        html += `<h1 class="text-3xl font-bold mt-8 mb-4">${line.substring(2)}</h1>`
      } else if (line.startsWith("## ")) {
        html += `<h2 class="text-2xl font-bold mt-6 mb-3">${line.substring(3)}</h2>`
      } else if (line.startsWith("### ")) {
        html += `<h3 class="text-xl font-bold mt-5 mb-2">${line.substring(4)}</h3>`
      } else if (line.startsWith("- ")) {
        html += `<li class="ml-6 list-disc">${line.substring(2)}</li>`
      } else if (line.startsWith("```")) {
        // Skip the opening and closing code block markers
        if (i + 1 < lines.length && !lines[i + 1].startsWith("```")) {
          html += `<pre class="bg-muted p-4 rounded-md my-4 overflow-x-auto"><code>`
          i++
          while (i < lines.length && !lines[i].startsWith("```")) {
            html += `${lines[i]}\n`
            i++
          }
          html += `</code></pre>`
        }
      } else if (line === "") {
        html += `<br />`
      } else {
        html += `<p class="my-4">${line}</p>`
      }
    }

    return html
  }

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Skeleton className="h-8 w-24 mb-4" />
              <Skeleton className="h-12 w-full mb-4" />

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="h-[300px] w-full mb-8" />

              <div className="space-y-4 mb-12">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>

            <div>
              <Skeleton className="h-[200px] w-full mb-6" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!post) {
    return null
  }

  return (
    <main className="flex-1 py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="rounded-full overflow-hidden h-10 w-10">
                  <Image
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime}</span>
              </div>
            </div>

            <div className="mb-8">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                width={1200}
                height={600}
                className="rounded-lg object-cover w-full"
              />
            </div>

            <div
              className="prose prose-lg dark:prose-invert max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />

            <div className="flex items-center justify-between mb-8">
              <PostActions
                postId={post._id}
                likes={post.likes}
                dislikes={post.dislikes}
                shares={post.shares}
                userLiked={post.userLiked}
                userDisliked={post.userDisliked}
                onCommentClick={scrollToComments}
              />
            </div>

            <Separator className="my-8" />

            <div ref={commentsRef}>
              <BlogComments postId={post._id} />
            </div>
          </div>

          <div>
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About the Author</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full overflow-hidden h-16 w-16">
                      <Image
                        src={post.author.image || "/placeholder.svg"}
                        alt={post.author.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{post.author.name}</p>
                      <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    A passionate developer who loves creating modern web applications and sharing knowledge with the
                    community.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/#about">More About Me</Link>
                  </Button>
                </CardContent>
              </Card>

              {relatedPosts.length > 0 && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <div key={relatedPost._id} className="flex gap-4">
                          <div className="rounded-md overflow-hidden h-16 w-16 flex-shrink-0">
                            <Image
                              src={relatedPost.image || "/placeholder.svg"}
                              alt={relatedPost.title}
                              width={64}
                              height={64}
                              className="object-cover h-full w-full"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/blog/${relatedPost.slug}`}
                              className="font-medium hover:text-primary transition-colors line-clamp-2"
                            >
                              {relatedPost.title}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(relatedPost.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

