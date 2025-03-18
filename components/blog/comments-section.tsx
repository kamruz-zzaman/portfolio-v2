"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import the BlogComments component with no SSR
const BlogComments = dynamic(() => import("@/components/blog/blog-comments"), {
  ssr: false,
  loading: () => <CommentsLoading />,
})

function CommentsLoading() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">Comments</h2>
      <div className="space-y-8">
        {[1, 2].map((i) => (
          <div key={i} className="border-b pb-8">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-16 w-full mt-2" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface CommentsSectionProps {
  postSlug: string
}

export default function CommentsSection({ postSlug }: CommentsSectionProps) {
  return (
    <Suspense fallback={<CommentsLoading />}>
      <BlogComments postSlug={postSlug} />
    </Suspense>
  )
}

