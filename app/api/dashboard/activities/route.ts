import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import UserInteraction from "@/models/user-interaction"
import Comment from "@/models/comment"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get recent interactions
    const interactions = await UserInteraction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name image")
      .populate("post", "title")
      .populate("comment", "content")

    // Format activities
    const activities = await Promise.all(
      interactions.map(async (interaction) => {
        let action = ""
        let target = ""

        if (interaction.post) {
          if (interaction.type === "like") {
            action = "liked"
            target = interaction.post.title
          } else if (interaction.type === "dislike") {
            action = "disliked"
            target = interaction.post.title
          } else if (interaction.type === "view") {
            action = "viewed"
            target = interaction.post.title
          } else if (interaction.type === "share") {
            action = "shared"
            target = interaction.post.title
          }
        } else if (interaction.comment) {
          if (interaction.type === "like") {
            action = "liked a comment on"

            // Get post title for the comment
            const comment = await Comment.findById(interaction.comment._id).populate("post", "title")

            if (comment && comment.post) {
              target = comment.post.title
            }
          }
        }

        return {
          id: interaction._id,
          user: interaction.user,
          action,
          target,
          createdAt: interaction.createdAt,
        }
      }),
    )

    // Filter out activities with no action
    const validActivities = activities.filter((activity) => activity.action)

    return NextResponse.json({ activities: validActivities })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

