"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ArrowRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description: "A full-featured online shopping platform with payment integration",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    github: "https://github.com/kamruz/ecommerce-platform",
    demo: "https://ecommerce-platform.example.com",
    slug: "ecommerce-platform",
  },
  {
    id: "task-management",
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
    github: "https://github.com/kamruz/task-management",
    demo: "https://task-management.example.com",
    slug: "task-management",
  },
  {
    id: "ai-content-generator",
    title: "AI Content Generator",
    description: "An AI-powered application that generates content based on user prompts",
    image: "/placeholder.svg?height=300&width=500",
    tags: ["React", "OpenAI API", "Express", "PostgreSQL"],
    github: "https://github.com/kamruz/ai-content-generator",
    demo: "https://ai-content-generator.example.com",
    slug: "ai-content-generator",
  },
]

export default function Projects() {
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
    <section id="projects" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm">Projects</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">My Recent Work</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Check out some of the projects I've worked on recently.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <motion.div key={project.id} variants={itemVariants} transition={{ delay: index * 0.1 }}>
              <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg">
                <div className="overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/projects/${project.slug}`}>
                      Details
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
            <Link href="https://github.com/kamruz" target="_blank" rel="noopener noreferrer">
              View More on GitHub
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

