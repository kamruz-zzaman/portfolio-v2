"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

export function NavigationLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    const handleStart = () => {
      setIsNavigating(true)
    }

    const handleComplete = () => {
      setIsNavigating(false)
    }

    // Add event listeners for navigation events
    document.addEventListener("navigationStart", handleStart)
    document.addEventListener("navigationComplete", handleComplete)

    return () => {
      document.removeEventListener("navigationStart", handleStart)
      document.removeEventListener("navigationComplete", handleComplete)
    }
  }, [])

  // Reset navigation state when route changes
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-background">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

