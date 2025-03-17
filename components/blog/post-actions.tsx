"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface PostActionsProps {
  postId: string
  likes: number
  dislikes: number
  shares: number
  userLiked?: boolean
  userDisliked?: boolean
  onCommentClick: () => void
}

export function PostActions({
  postId,
  likes,
  dislikes,
  shares,
  userLiked = false,
  userDisliked = false,
  onCommentClick,
}: PostActionsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [likesCount, setLikesCount] = useState(likes)
  const [dislikesCount, setDislikesCount] = useState(dislikes)
  const [sharesCount, setSharesCount] = useState(shares)
  const [isLiked, setIsLiked] = useState(userLiked)
  const [isDisliked, setIsDisliked] = useState(userDisliked)
  const [shareUrl, setShareUrl] = useState("")
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const handleLike = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setIsLoading("like")

    try {
      const response = await fetch(`/api/posts/${postId}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "like" }),
      })

      if (!response.ok) {
        throw new Error("Failed to like post")
      }

      const data = await response.json()

      setLikesCount(data.likes)
      setDislikesCount(data.dislikes)
      setIsLiked(true)
      setIsDisliked(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleDislike = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setIsLoading("dislike")

    try {
      const response = await fetch(`/api/posts/${postId}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "dislike" }),
      })

      if (!response.ok) {
        throw new Error("Failed to dislike post")
      }

      const data = await response.json()

      setLikesCount(data.likes)
      setDislikesCount(data.dislikes)
      setIsLiked(false)
      setIsDisliked(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dislike post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleShare = async (platform: string) => {
    setIsLoading("share")

    try {
      // Record share interaction
      await fetch(`/api/posts/${postId}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "share" }),
      })

      // Get current URL
      const url = window.location.href

      // Share based on platform
      switch (platform) {
        case "copy":
          await navigator.clipboard.writeText(url)
          toast({
            title: "Link copied",
            description: "Post link copied to clipboard",
          })
          break
        case "twitter":
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, "_blank")
          break
        case "facebook":
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
          break
        case "linkedin":
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
          break
      }

      setSharesCount((prev) => prev + 1)
      setShareDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading !== null}
        className={isLiked ? "text-primary" : ""}
      >
        {isLoading === "like" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ThumbsUp className="mr-2 h-4 w-4" />
        )}
        {likesCount}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        disabled={isLoading !== null}
        className={isDisliked ? "text-primary" : ""}
      >
        {isLoading === "dislike" ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ThumbsDown className="mr-2 h-4 w-4" />
        )}
        {dislikesCount}
      </Button>

      <Button variant="ghost" size="sm" onClick={onCommentClick} disabled={isLoading !== null}>
        <MessageSquare className="mr-2 h-4 w-4" />
        Comment
      </Button>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" disabled={isLoading !== null}>
            {isLoading === "share" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="mr-2 h-4 w-4" />
            )}
            {sharesCount}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this post</DialogTitle>
            <DialogDescription>Choose how you want to share this post</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Input value={window.location.href} readOnly className="flex-1" />
              <Button onClick={() => handleShare("copy")}>Copy</Button>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => handleShare("twitter")}>
                Twitter
              </Button>
              <Button variant="outline" onClick={() => handleShare("facebook")}>
                Facebook
              </Button>
              <Button variant="outline" onClick={() => handleShare("linkedin")}>
                LinkedIn
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

