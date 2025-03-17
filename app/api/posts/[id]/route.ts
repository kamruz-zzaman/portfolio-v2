import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Post from "@/models/post"
import UserInteraction from "@/models/user-interaction"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const post = await Post.findById(params.id).populate("author", "name image")

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Get user interactions if logged in
    const session = await getServerSession(authOptions)
    const postObj = post.toObject()

    if (session) {
      const userInteraction = await UserInteraction.findOne({
        user: session.user.id,
        post: params.id,
        type: { $in: ["like", "dislike"] },
      })

      if (userInteraction) {
        postObj.userLiked = userInteraction.type === "like"
        postObj.userDisliked = userInteraction.type === "dislike"
      }

      // Record view if not already viewed
      const viewInteraction = await UserInteraction.findOne({
        user: session.user.id,
        post: params.id,
        type: "view",
      })

      if (!viewInteraction) {
        await UserInteraction.create({
          user: session.user.id,
          post: params.id,
          type: "view",
        })

        post.views += 1
        await post.save()
        postObj.views = post.views
      }
    }

    return NextResponse.json({ post: postObj })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate input
    if (!data.title || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if slug is being changed and already exists
    if (data.slug && data.slug !== post.slug) {
      const existingPost = await Post.findOne({ slug: data.slug })

      if (existingPost) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
      }
    }

    // Update post
    Object.assign(post, data)
    await post.save()

    // Populate author
    await post.populate("author", "name image")

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Delete post
    await post.deleteOne()

    // Delete all interactions
    await UserInteraction.deleteMany({ post: params.id })

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

