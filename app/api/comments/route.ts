import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Comment from "@/models/comment"
import UserInteraction from "@/models/user-interaction"

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

    // Get user interactions if logged in
    const session = await getServerSession(authOptions)
    let userInteractions = []

    if (session) {
      const commentIds = comments.map((comment) => comment._id)
      userInteractions = await UserInteraction.find({
        user: session.user.id,
        comment: { $in: commentIds },
        type: "like",
      })
    }

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parent: comment._id })
          .sort({ createdAt: 1 })
          .populate("author", "name image")

        // Format replies with user interaction data
        const formattedReplies = replies.map((reply) => {
          const replyObj = reply.toObject()

          if (session) {
            replyObj.userLiked = userInteractions.some(
              (interaction) => interaction.comment.toString() === reply._id.toString(),
            )
          }

          return replyObj
        })

        const commentObj = comment.toObject()

        if (session) {
          commentObj.userLiked = userInteractions.some(
            (interaction) => interaction.comment.toString() === comment._id.toString(),
          )
        }

        return {
          ...commentObj,
          replies: formattedReplies,
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

