import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Post from "@/models/post"
import UserInteraction from "@/models/user-interaction"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type } = await req.json()

    if (!["like", "dislike", "view", "share"].includes(type)) {
      return NextResponse.json({ error: "Invalid interaction type" }, { status: 400 })
    }

    await connectToDatabase()

    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user already interacted with this post
    const existingInteraction = await UserInteraction.findOne({
      user: session.user.id,
      post: params.id,
      type: type === "dislike" ? "like" : type === "like" ? "dislike" : type,
    })

    // If toggling between like and dislike
    if ((type === "like" || type === "dislike") && existingInteraction) {
      // Remove the opposite interaction
      await UserInteraction.deleteOne({
        _id: existingInteraction._id,
      })

      // Update post counts
      if (type === "like") {
        post.dislikes = Math.max(0, post.dislikes - 1)
      } else {
        post.likes = Math.max(0, post.likes - 1)
      }
    }

    // Create new interaction
    try {
      await UserInteraction.create({
        user: session.user.id,
        post: params.id,
        type,
      })

      // Update post counts
      if (type === "like") {
        post.likes += 1
      } else if (type === "dislike") {
        post.dislikes += 1
      } else if (type === "view") {
        post.views += 1
      } else if (type === "share") {
        post.shares += 1
      }

      await post.save()

      return NextResponse.json({
        message: `Post ${type}d successfully`,
        likes: post.likes,
        dislikes: post.dislikes,
        shares: post.shares,
        views: post.views,
      })
    } catch (error) {
      // If duplicate interaction, just return the current counts
      if (error.code === 11000) {
        return NextResponse.json({
          message: `Post already ${type}d`,
          likes: post.likes,
          dislikes: post.dislikes,
          shares: post.shares,
          views: post.views,
        })
      }
      throw error
    }
  } catch (error) {
    console.error(`Error ${type}ing post:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type } = await req.json()

    if (!["like", "dislike"].includes(type)) {
      return NextResponse.json({ error: "Invalid interaction type" }, { status: 400 })
    }

    await connectToDatabase()

    const post = await Post.findById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Remove interaction
    const result = await UserInteraction.deleteOne({
      user: session.user.id,
      post: params.id,
      type,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: `Post not ${type}d` }, { status: 404 })
    }

    // Update post counts
    if (type === "like") {
      post.likes = Math.max(0, post.likes - 1)
    } else if (type === "dislike") {
      post.dislikes = Math.max(0, post.dislikes - 1)
    }

    await post.save()

    return NextResponse.json({
      message: `Post ${type} removed successfully`,
      likes: post.likes,
      dislikes: post.dislikes,
    })
  } catch (error) {
    console.error(`Error removing ${type}:`, error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

