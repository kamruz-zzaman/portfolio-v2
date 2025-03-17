import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Post from "@/models/post"
import UserInteraction from "@/models/user-interaction"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const published = searchParams.get("published")
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    await connectToDatabase()

    const query: any = {}

    if (published === "true") {
      query.published = true
    }

    if (category) {
      query.category = category
    }

    if (featured === "true") {
      query.featured = true
    }

    const totalPosts = await Post.countDocuments(query)

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name image")

    // Get user interactions if logged in
    const session = await getServerSession(authOptions)
    let userInteractions = []

    if (session) {
      const postIds = posts.map((post) => post._id)
      userInteractions = await UserInteraction.find({
        user: session.user.id,
        post: { $in: postIds },
      })
    }

    // Format posts with user interaction data
    const formattedPosts = posts.map((post) => {
      const postObj = post.toObject()

      if (session) {
        postObj.userLiked = userInteractions.some(
          (interaction) => interaction.post.toString() === post._id.toString() && interaction.type === "like",
        )
        postObj.userDisliked = userInteractions.some(
          (interaction) => interaction.post.toString() === post._id.toString() && interaction.type === "dislike",
        )
      }

      return postObj
    })

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total: totalPosts,
        page,
        limit,
        pages: Math.ceil(totalPosts / limit),
      },
    })
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

    // Populate author
    await post.populate("author", "name image")

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

