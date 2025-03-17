import { seedDatabase } from "./seed-db"

// This function will be called when the app starts
export async function autoSeedDatabase() {
  // Only run in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("Auto-seeding database in development mode...")
    try {
      const result = await seedDatabase()
      if (result.success) {
        console.log("Auto-seeding completed successfully")
      } else {
        console.error("Auto-seeding failed:", result.error)
      }
    } catch (error) {
      console.error("Error during auto-seeding:", error)
    }
  }
}

