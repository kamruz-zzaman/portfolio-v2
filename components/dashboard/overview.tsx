"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface OverviewData {
  name: string
  total: number
}

export function Overview() {
  const [data, setData] = useState<OverviewData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch("/api/dashboard/analytics")

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const { data } = await response.json()
      setData(data)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      // Fallback to sample data if API fails
      setData([
        { name: "Jan", total: 1200 },
        { name: "Feb", total: 1900 },
        { name: "Mar", total: 1500 },
        { name: "Apr", total: 1700 },
        { name: "May", total: 2400 },
        { name: "Jun", total: 2100 },
        { name: "Jul", total: 2800 },
        { name: "Aug", total: 3200 },
        { name: "Sep", total: 2800 },
        { name: "Oct", total: 3000 },
        { name: "Nov", total: 3500 },
        { name: "Dec", total: 3700 },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

