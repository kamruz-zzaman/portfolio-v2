import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Comment from "@/models/comment"
import UserInteraction from "@/models/user-interaction"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type } = await req.json()

    if (type !== "like") {
      return NextResponse.json({ error: "Invalid interaction type for comments" }, { status: 400 })
    }

    await connectToDatabase()

    const comment = await Comment.findById(params.id)

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Create new interaction
    try {
      await UserInteraction.create({
        user: session.user.id,
        comment: params.id,
        type,
      })

      // Update comment likes
      comment.likes += 1
      await comment.save()

      return NextResponse.json({
        message: "Comment liked successfully",
        likes: comment.likes,
      })
    } catch (error) {
      // If duplicate interaction, just return the current likes
      if (error.code === 11000) {
        return NextResponse.json({
          message: "Comment already liked",
          likes: comment.likes,
        })
      }
      throw error
    }
  } catch (error) {
    console.error("Error liking comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const comment = await Comment.findById(params.id)

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Remove interaction
    const result = await UserInteraction.deleteOne({
      user: session.user.id,
      comment: params.id,
      type: "like",
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Comment not liked" }, { status: 404 })
    }

    // Update comment likes
    comment.likes = Math.max(0, comment.likes - 1)
    await comment.save()

    return NextResponse.json({
      message: "Comment like removed successfully",
      likes: comment.likes,
    })
  } catch (error) {
    console.error("Error removing comment like:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

