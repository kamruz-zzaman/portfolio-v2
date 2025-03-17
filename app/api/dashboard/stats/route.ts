import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Post from "@/models/post"
import Project from "@/models/project"
import Comment from "@/models/comment"
import User from "@/models/user"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get current date and last month date
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

    // Get counts
    const projectsCount = await Project.countDocuments()
    const postsCount = await Post.countDocuments()
    const commentsCount = await Comment.countDocuments()
    const usersCount = await User.countDocuments()

    // Get last month counts
    const lastMonthProjectsCount = await Project.countDocuments({
      createdAt: { $lt: lastMonth },
    })

    const lastMonthPostsCount = await Post.countDocuments({
      createdAt: { $lt: lastMonth },
    })

    const lastMonthCommentsCount = await Comment.countDocuments({
      createdAt: { $lt: lastMonth },
    })

    const lastMonthUsersCount = await User.countDocuments({
      createdAt: { $lt: lastMonth },
    })

    // Calculate changes
    const projectsChange = projectsCount - lastMonthProjectsCount
    const postsChange = postsCount - lastMonthPostsCount
    const commentsChange = commentsCount - lastMonthCommentsCount
    const usersChange = usersCount - lastMonthUsersCount

    return NextResponse.json({
      projects: projectsCount,
      posts: postsCount,
      comments: commentsCount,
      users: usersCount,
      projectsChange,
      postsChange,
      commentsChange,
      usersChange,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

