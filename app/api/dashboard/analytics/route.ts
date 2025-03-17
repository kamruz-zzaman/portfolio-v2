import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import UserInteraction from "@/models/user-interaction"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get monthly post views
    const currentYear = new Date().getFullYear()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Initialize data with zeros for all months
    const monthlyData = months.map((month) => ({
      name: month,
      total: 0,
    }))

    // Get view interactions for the current year
    const viewInteractions = await UserInteraction.aggregate([
      {
        $match: {
          type: "view",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
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

    // Update monthly data with actual counts
    viewInteractions.forEach((item) => {
      const monthIndex = item._id - 1 // MongoDB months are 1-indexed
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].total = item.count
      }
    })

    return NextResponse.json({ data: monthlyData })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

