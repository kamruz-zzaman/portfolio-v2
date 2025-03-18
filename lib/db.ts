import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

// Global is used here to maintain a cached connection across hot reloads
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      maxPoolSize: 10, // Maintain up to 10 socket connections
    }

    // Handle missing MongoDB URI gracefully
    if (!MONGODB_URI) {
      console.warn("MONGODB_URI not found - database connection skipped")
      return null
    }

    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts)
    } catch (e) {
      cached.promise = null
      console.error("MongoDB connection error:", e)
      return null
    }
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("MongoDB connection error:", e)
    return null
  }

  return cached.conn
}

export default connectToDatabase

