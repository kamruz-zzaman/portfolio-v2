import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Post from "@/models/post"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const published = searchParams.get("published")
    const category = searchParams.get("category")

    await connectToDatabase()

    const query: any = {}

    if (published === "true") {
      query.published = true
    }

    if (category) {
      query.category = category
    }

    const posts = await Post.find(query).sort({ createdAt: -1 }).populate("author", "name image")

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate input
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug: data.slug })

    if (existingPost) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }

    // Create post with author from session
    const post = await Post.create({
      ...data,
      author: session.user.id,
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

