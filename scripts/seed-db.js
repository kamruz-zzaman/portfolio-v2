// This is a simple script to manually seed the database
// Run with: node scripts/seed-db.js

const https = require("https")

console.log("Triggering database seeding...")

// Make a request to the seed API endpoint
https
  .get("http://localhost:3000/api/seed", (res) => {
    let data = ""

    res.on("data", (chunk) => {
      data += chunk
    })

    res.on("end", () => {
      try {
        const response = JSON.parse(data)
        if (response.message) {
          console.log("Success:", response.message)
        } else if (response.error) {
          console.error("Error:", response.error)
        }
      } catch (e) {
        console.error("Error parsing response:", e)
      }
    })
  })
  .on("error", (err) => {
    console.error("Error making request:", err.message)
  })

