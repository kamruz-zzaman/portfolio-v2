import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Comment from "@/models/comment"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    const comments = await Comment.find({ post: postId, parent: null })
      .sort({ createdAt: -1 })
      .populate("author", "name image")

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parent: comment._id })
          .sort({ createdAt: 1 })
          .populate("author", "name image")

        return {
          ...comment.toObject(),
          replies,
        }
      }),
    )

    return NextResponse.json({ comments: commentsWithReplies })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate input
    if (!data.postId || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Create comment
    const comment = await Comment.create({
      post: data.postId,
      author: session.user.id,
      content: data.content,
      parent: data.parentId || null,
    })

    // Populate author
    await comment.populate("author", "name image")

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

