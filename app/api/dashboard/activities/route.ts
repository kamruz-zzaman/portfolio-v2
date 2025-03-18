import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import UserInteraction from "@/models/user-interaction"
import Comment from "@/models/comment"
import Post from "@/models/post"
import Project from "@/models/project"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined

    await connectToDatabase()

    // Build date filter if provided
    const dateFilter = {}
    if (startDate || endDate) {
      dateFilter["createdAt"] = {}
      if (startDate) dateFilter["createdAt"]["$gte"] = new Date(startDate)
      if (endDate) dateFilter["createdAt"]["$lte"] = new Date(endDate)
    }

    // Get recent interactions
    const interactions = await UserInteraction.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name image")
      .populate("post", "title")
      .populate("comment", "content")

    // Format activities
    const activities = await Promise.all(
      interactions.map(async (interaction) => {
        let action = ""
        let target = ""
        let targetType = ""

        if (interaction.post) {
          targetType = "post"
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
          targetType = "comment"
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
          targetType,
          createdAt: interaction.createdAt,
        }
      }),
    )

    // Filter out activities with no action
    const validActivities = activities.filter((activity) => activity.action)

    // Get recent content creations
    const recentPosts = await Post.find(dateFilter).sort({ createdAt: -1 }).limit(5).populate("author", "name image")

    const recentProjects = await Project.find(dateFilter).sort({ createdAt: -1 }).limit(5)

    const recentComments = await Comment.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "name image")
      .populate("post", "title")

    // Format content creations as activities
    const postActivities = recentPosts.map((post) => ({
      id: `post-${post._id}`,
      user: post.author,
      action: "created post",
      target: post.title,
      targetType: "post",
      createdAt: post.createdAt,
    }))

    const projectActivities = recentProjects.map((project) => ({
      id: `project-${project._id}`,
      user: { name: "Admin", image: "/placeholder.svg?height=40&width=40" },
      action: "created project",
      target: project.title,
      targetType: "project",
      createdAt: project.createdAt,
    }))

    const commentActivities = recentComments.map((comment) => ({
      id: `comment-${comment._id}`,
      user: comment.author,
      action: "commented on",
      target: comment.post?.title || "a post",
      targetType: "comment",
      createdAt: comment.createdAt,
    }))

    // Combine all activities and sort by date
    const allActivities = [...validActivities, ...postActivities, ...projectActivities, ...commentActivities]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)

    return NextResponse.json({ activities: allActivities })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

