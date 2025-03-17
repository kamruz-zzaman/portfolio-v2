import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-db"

export async function GET(req: Request) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Seeding is only allowed in development mode" }, { status: 403 })
  }

  try {
    console.log("Manual seeding triggered...")
    const result = await seedDatabase()

    if (!result.success) {
      return NextResponse.json({ error: "Failed to seed database", details: result.error }, { status: 500 })
    }

    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

