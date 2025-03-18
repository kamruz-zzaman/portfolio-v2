import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import CommentsSection from "@/components/blog/comments-section"

// This would typically come from a database or CMS
const blogPosts = [
  {
    id: "nextjs-vs-react",
    title: "Next.js vs React: When to Use Each",
    excerpt: "A comprehensive comparison of Next.js and React, helping you decide which is best for your project.",
    content: `
      # Next.js vs React: When to Use Each

      When starting a new web project, one of the first decisions you'll need to make is which framework or library to use. React and Next.js are two popular choices, but understanding when to use each can be challenging. This article will help you make an informed decision based on your project requirements.

      ## What is React?

      React is a JavaScript library for building user interfaces, particularly single-page applications. It allows developers to create reusable UI components and manage the state of these components efficiently. React was developed by Facebook and has become one of the most popular frontend libraries in the world.

      ### Key Features of React:

      - **Component-Based Architecture**: React allows you to build encapsulated components that manage their own state.
      - **Virtual DOM**: React creates a lightweight representation of the real DOM in memory, which improves performance.
      - **JSX**: JSX is a syntax extension that allows you to write HTML-like code in JavaScript.
      - **Unidirectional Data Flow**: Data in React flows in one direction, making it easier to understand how data changes affect the application.

      ## What is Next.js?

      Next.js is a React framework that provides additional structure, features, and optimizations. It was created by Vercel and has gained significant popularity for its ability to simplify the development of React applications.

      ### Key Features of Next.js:

      - **Server-Side Rendering (SSR)**: Next.js can render React components on the server before sending them to the client.
      - **Static Site Generation (SSG)**: Next.js can generate static HTML at build time, which can be served from a CDN.
      - **File-Based Routing**: Next.js uses a file-based routing system, where each file in the pages directory becomes a route.
      - **API Routes**: Next.js allows you to create API endpoints as part of your application.
      - **Built-in CSS and Sass Support**: Next.js has built-in support for CSS and Sass, making it easier to style your application.

      ## When to Use React

      React is a great choice when:

      1. **You're building a single-page application (SPA)**: If your application doesn't require server-side rendering or SEO optimization, React is a lightweight option.
      2. **You need complete control over your application structure**: React gives you the freedom to structure your application however you want.
      3. **You're integrating with an existing backend**: If you already have a backend that serves your API, React can be used to build the frontend.
      4. **You're building a library or a component that will be used in different applications**: React's component-based architecture makes it ideal for creating reusable UI components.

      ## When to Use Next.js

      Next.js is a better choice when:

      1. **SEO is important for your application**: Next.js's server-side rendering capabilities make it easier for search engines to index your content.
      2. **You need fast page loads**: Server-side rendering and static site generation can significantly improve the perceived performance of your application.
      3. **You're building a large application**: Next.js provides a structured approach to building applications, which can be beneficial for larger projects.
      4. **You need built-in API routes**: Next.js allows you to create API endpoints as part of your application, which can be useful for simple backends.
      5. **You want a more opinionated framework**: Next.js provides conventions and best practices that can help you build applications more quickly.

      ## Conclusion

      Both React and Next.js are excellent choices for building modern web applications. The decision between them should be based on your specific project requirements. If you need a lightweight library with complete control over your application structure, React might be the better choice. If you need server-side rendering, static site generation, or a more opinionated framework, Next.js could be the way to go.

      Remember that Next.js is built on top of React, so you're not choosing between two completely different technologies. Instead, you're deciding whether the additional features and structure provided by Next.js are beneficial for your project.
    `,
    image: "/placeholder.svg?height=600&width=1200",
    date: "2023-10-15",
    readTime: "5 min read",
    category: "Web Development",
    author: {
      name: "Kamruz",
      image: "/placeholder.svg?height=100&width=100",
    },
    slug: "nextjs-vs-react",
  },
  {
    id: "typescript-best-practices",
    title: "TypeScript Best Practices for 2023",
    excerpt: "Learn the latest TypeScript best practices to write cleaner, more maintainable code.",
    content: `
      # TypeScript Best Practices for 2023

      TypeScript has become an essential tool for many JavaScript developers, providing static type checking and other features that help catch errors early and make code more maintainable. As we move through 2023, here are some best practices to follow when working with TypeScript.

      ## Use Strict Mode

      TypeScript's strict mode enables a set of type-checking options that catch more potential errors. You can enable strict mode in your tsconfig.json file:

      \`\`\`json
      {
        "compilerOptions": {
          "strict": true
        }
      }
      \`\`\`

      This enables several flags, including:

      - noImplicitAny: Disallows expressions and declarations with an implied 'any' type.
      - strictNullChecks: Makes handling null and undefined more explicit.
      - strictFunctionTypes: Enables more correct checking of function types.
      - strictPropertyInitialization: Ensures class properties are initialized.

      ## Prefer Interfaces Over Type Aliases for Object Types

      While both interfaces and type aliases can be used to define object types, interfaces are generally preferred for a few reasons:

      - Interfaces can be extended and implemented.
      - Interfaces can be augmented (declaration merging).
      - Interfaces provide better error messages.

      \`\`\`typescript
      // Prefer this:
      interface User {
        id: number;
        name: string;
        email: string;
      }

      // Over this:
      type User = {
        id: number;
        name: string;
        email: string;
      };
      \`\`\`

      However, type aliases are still useful for union types, mapped types, and other advanced type features.

      ## Use Type Inference When Possible

      TypeScript's type inference is powerful and can often determine the correct type without explicit annotations. This can make your code more concise and easier to read.

      \`\`\`typescript
      // Let TypeScript infer the type
      const numbers = [1, 2, 3]; // inferred as number[]

      // Only add type annotations when necessary
      function getUser(id: number): User {
        // ...
      }
      \`\`\`

      ## Avoid Using 'any'

      The 'any' type effectively turns off type checking for a variable or expression. While it can be tempting to use 'any' to quickly fix type errors, it defeats the purpose of using TypeScript.

      Instead of 'any', consider using:

      - 'unknown' for values whose type you don't know.
      - Type assertions when you know more about a type than TypeScript does.
      - Proper type definitions or interfaces.

      ## Use Discriminated Unions for Complex Types

      Discriminated unions are a powerful way to model complex types in TypeScript. They involve using a common property (the discriminant) to differentiate between different types in a union.

      \`\`\`typescript
      interface Square {
        kind: 'square';
        size: number;
      }

      interface Rectangle {
        kind: 'rectangle';
        width: number;
        height: number;
      }

      interface Circle {
        kind: 'circle';
        radius: number;
      }

      type Shape = Square | Rectangle | Circle;

      function area(shape: Shape): number {
        switch (shape.kind) {
          case 'square':
            return shape.size * shape.size;
          case 'rectangle':
            return shape.width * shape.height;
          case 'circle':
            return Math.PI * shape.radius ** 2;
        }
      }
      \`\`\`

      ## Use Readonly for Immutable Data

      TypeScript provides the 'readonly' modifier and 'Readonly<T>' utility type to indicate that a property or object should not be modified.

      \`\`\`typescript
      interface Config {
        readonly apiKey: string;
        readonly endpoint: string;
      }

      // Or use the Readonly utility type
      type Config = Readonly<{
        apiKey: string;
        endpoint: string;
      }>;
      \`\`\`

      ## Use Nullish Coalescing and Optional Chaining

      TypeScript 3.7 introduced nullish coalescing (??) and optional chaining (?.), which are powerful features for handling null and undefined values.

      \`\`\`typescript
      // Nullish coalescing
      const value = data.value ?? defaultValue;

      // Optional chaining
      const name = user?.profile?.name;
      \`\`\`

      ## Conclusion

      Following these best practices will help you write more maintainable, robust TypeScript code in 2023. Remember that TypeScript is a tool to help you catch errors early and make your code more self-documenting. Use its features wisely to improve your development experience and code quality.
    `,
    image: "/placeholder.svg?height=600&width=1200",
    date: "2023-09-22",
    readTime: "7 min read",
    category: "TypeScript",
    author: {
      name: "Kamruz",
      image: "/placeholder.svg?height=100&width=100",
    },
    slug: "typescript-best-practices",
  },
]

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    return <div>Post not found</div>
  }

  // Convert markdown-like content to HTML (this is a simplified version)
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
                <span>{post.date}</span>
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
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Dislike
                </Button>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Use the client component wrapper instead of direct dynamic import */}
            <CommentsSection postSlug={post.slug} />
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

              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {blogPosts
                      .filter((p) => p.slug !== post.slug)
                      .slice(0, 2)
                      .map((relatedPost) => (
                        <div key={relatedPost.id} className="flex gap-4">
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
                            <p className="text-xs text-muted-foreground mt-1">{relatedPost.date}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

