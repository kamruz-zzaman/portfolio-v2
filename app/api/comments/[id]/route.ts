import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Comment from "@/models/comment"
import UserInteraction from "@/models/user-interaction"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const comment = await Comment.findById(params.id).populate("author", "name image").populate("post", "title slug")

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error("Error fetching comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate input
    if (!data.content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    await connectToDatabase()

    const comment = await Comment.findById(params.id)

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user is the author or admin
    if (comment.author.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to edit this comment" }, { status: 403 })
    }

    // Update comment
    comment.content = data.content
    await comment.save()

    return NextResponse.json({ comment })
  } catch (error) {
    console.error("Error updating comment:", error)
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

    // Check if user is the author or admin
    if (comment.author.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to delete this comment" }, { status: 403 })
    }

    // Delete comment and its replies
    await Comment.deleteMany({ $or: [{ _id: params.id }, { parent: params.id }] })

    // Delete associated interactions
    await UserInteraction.deleteMany({ comment: params.id })

    return NextResponse.json({ message: "Comment deleted successfully" })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

