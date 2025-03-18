import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import UserInteraction from "@/models/user-interaction"
import Post from "@/models/post"
import Project from "@/models/project"
import Comment from "@/models/comment"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("startDate") || new Date(new Date().getFullYear(), 0, 1).toISOString()
    const endDate = searchParams.get("endDate") || new Date().toISOString()

    await connectToDatabase()

    // Get monthly data for views, posts, projects, and comments
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Initialize data with zeros for all months
    const monthlyData = months.map((month) => ({
      name: month,
      views: 0,
      posts: 0,
      projects: 0,
      comments: 0,
    }))

    // Get view interactions
    const viewInteractions = await UserInteraction.aggregate([
      {
        $match: {
          type: "view",
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ])

    // Update monthly data with view counts
    viewInteractions.forEach((item) => {
      const monthIndex = item._id - 1 // MongoDB months are 1-indexed
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].views = item.count
      }
    })

    // Get post creation data
    const postCreations = await Post.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ])

    // Update monthly data with post counts
    postCreations.forEach((item) => {
      const monthIndex = item._id - 1
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].posts = item.count
      }
    })

    // Get project creation data
    const projectCreations = await Project.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ])

    // Update monthly data with project counts
    projectCreations.forEach((item) => {
      const monthIndex = item._id - 1
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].projects = item.count
      }
    })

    // Get comment creation data
    const commentCreations = await Comment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ])

    // Update monthly data with comment counts
    commentCreations.forEach((item) => {
      const monthIndex = item._id - 1
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].comments = item.count
      }
    })

    return NextResponse.json({ data: monthlyData })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

