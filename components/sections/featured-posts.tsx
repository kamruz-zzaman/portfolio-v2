"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const featuredPosts = [
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
]

export default function FeaturedPosts() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm">Blog</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Posts</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Check out my latest articles on web development, design, and technology.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2"
        >
          {featuredPosts.map((post, index) => (
            <motion.div key={post.id} variants={itemVariants} transition={{ delay: index * 0.1 }}>
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
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
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex justify-center"
        >
          <Button asChild>
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

