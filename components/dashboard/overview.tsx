"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface OverviewData {
  name: string
  views: number
  posts: number
  projects: number
  comments: number
}

export function Overview() {
  const [data, setData] = useState<OverviewData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 1))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [activeMetrics, setActiveMetrics] = useState({
    views: true,
    posts: true,
    projects: true,
    comments: true,
  })

  useEffect(() => {
    fetchData()
  }, [startDate, endDate])

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Build query params
      const params = new URLSearchParams()
      if (startDate) params.append("startDate", startDate.toISOString())
      if (endDate) params.append("endDate", endDate.toISOString())

      const response = await fetch(`/api/dashboard/analytics?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const { data } = await response.json()
      setData(data)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      // Fallback to sample data if API fails
      setData([
        { name: "Jan", views: 1200, posts: 4, projects: 2, comments: 25 },
        { name: "Feb", views: 1900, posts: 3, projects: 1, comments: 30 },
        { name: "Mar", views: 1500, posts: 5, projects: 0, comments: 45 },
        { name: "Apr", views: 1700, posts: 2, projects: 3, comments: 20 },
        { name: "May", views: 2400, posts: 6, projects: 1, comments: 35 },
        { name: "Jun", views: 2100, posts: 3, projects: 2, comments: 40 },
        { name: "Jul", views: 2800, posts: 4, projects: 0, comments: 55 },
        { name: "Aug", views: 3200, posts: 7, projects: 3, comments: 60 },
        { name: "Sep", views: 2800, posts: 5, projects: 1, comments: 48 },
        { name: "Oct", views: 3000, posts: 4, projects: 2, comments: 52 },
        { name: "Nov", views: 3500, posts: 6, projects: 1, comments: 58 },
        { name: "Dec", views: 3700, posts: 8, projects: 4, comments: 65 },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMetric = (metric: keyof typeof activeMetrics) => {
    setActiveMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }))
  }

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
            </PopoverContent>
          </Popover>
          <span>to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={activeMetrics.views ? "default" : "outline"} onClick={() => toggleMetric("views")}>
            Views
          </Button>
          <Button size="sm" variant={activeMetrics.posts ? "default" : "outline"} onClick={() => toggleMetric("posts")}>
            Posts
          </Button>
          <Button
            size="sm"
            variant={activeMetrics.projects ? "default" : "outline"}
            onClick={() => toggleMetric("projects")}
          >
            Projects
          </Button>
          <Button
            size="sm"
            variant={activeMetrics.comments ? "default" : "outline"}
            onClick={() => toggleMetric("comments")}
          >
            Comments
          </Button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Legend />
          {activeMetrics.views && <Bar dataKey="views" name="Views" fill="#3b82f6" radius={[4, 4, 0, 0]} />}
          {activeMetrics.posts && <Bar dataKey="posts" name="Posts" fill="#10b981" radius={[4, 4, 0, 0]} />}
          {activeMetrics.projects && <Bar dataKey="projects" name="Projects" fill="#f59e0b" radius={[4, 4, 0, 0]} />}
          {activeMetrics.comments && <Bar dataKey="comments" name="Comments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

