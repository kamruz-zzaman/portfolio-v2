"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      email: "john@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    action: "commented on",
    target: "TypeScript Best Practices",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    action: "liked",
    target: "Next.js vs React",
    time: "5 hours ago",
  },
  {
    id: 3,
    user: {
      name: "Michael Chen",
      email: "michael@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    action: "signed up",
    target: "",
    time: "1 day ago",
  },
  {
    id: 4,
    user: {
      name: "Emily Wilson",
      email: "emily@example.com",
      image: "/placeholder.svg?height=32&width=32",
    },
    action: "commented on",
    target: "E-Commerce Platform",
    time: "2 days ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.image} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
              {activity.target && <span className="font-semibold">{activity.target}</span>}
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

