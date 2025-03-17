"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, Reply, MoreHorizontal, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"

interface Author {
  _id: string
  name: string
  image: string
}

interface Comment {
  _id: string
  author: Author
  content: string
  createdAt: string
  likes: number
  userLiked?: boolean
  replies?: Comment[]
}

interface BlogCommentsProps {
  postId: string
}

export default function BlogComments({ postId }: BlogCommentsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }

      const data = await response.json()
      setComments(data.comments)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    if (!newComment.trim()) return

    setSubmitting("comment")

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: newComment,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      const { comment } = await response.json()

      // Add the new comment to the list
      setComments([
        {
          ...comment,
          replies: [],
        },
        ...comments,
      ])

      setNewComment("")

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setSubmitting(null)
    }
  }

  const handleAddReply = async (commentId: string) => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    if (!replyContent.trim()) return

    setSubmitting(`reply-${commentId}`)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: replyContent,
          parentId: commentId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add reply")
      }

      const { comment } = await response.json()

      // Add the reply to the parent comment
      setComments(
        comments.map((c) => {
          if (c._id === commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), comment],
            }
          }
          return c
        }),
      )

      setReplyingTo(null)
      setReplyContent("")

      toast({
        title: "Reply added",
        description: "Your reply has been added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      })
    } finally {
      setSubmitting(null)
    }
  }

  const handleLike = async (commentId: string, isReply = false, parentId?: string) => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setSubmitting(`like-${commentId}`)

    try {
      const response = await fetch(`/api/comments/${commentId}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "like" }),
      })

      if (!response.ok) {
        throw new Error("Failed to like comment")
      }

      const data = await response.json()

      // Update comment likes
      if (isReply && parentId) {
        setComments(
          comments.map((comment) => {
            if (comment._id === parentId) {
              return {
                ...comment,
                replies: comment.replies?.map((reply) => {
                  if (reply._id === commentId) {
                    return {
                      ...reply,
                      likes: data.likes,
                      userLiked: true,
                    }
                  }
                  return reply
                }),
              }
            }
            return comment
          }),
        )
      } else {
        setComments(
          comments.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                likes: data.likes,
                userLiked: true,
              }
            }
            return comment
          }),
        )
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive",
      })
    } finally {
      setSubmitting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Comments ({comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0)})
      </h2>

      {session ? (
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
              <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddComment} disabled={submitting === "comment" || !newComment.trim()}>
              {submitting === "comment" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-muted p-4 rounded-lg mb-8 text-center">
          <p className="mb-2">Please log in to add a comment</p>
          <Button asChild>
            <a href={`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`}>Log In</a>
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border-b pb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.image} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{comment.author.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">More</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2">
                    <p>{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(comment._id)}
                      disabled={submitting === `like-${comment._id}`}
                      className={comment.userLiked ? "text-primary" : ""}
                    >
                      {submitting === `like-${comment._id}` ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <ThumbsUp className="h-4 w-4 mr-1" />
                      )}
                      {comment.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </div>

                  {replyingTo === comment._id && (
                    <div className="mt-4">
                      <div className="flex gap-4 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={session?.user.image || ""} alt={session?.user.name || "User"} />
                          <AvatarFallback>{session?.user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <Textarea
                          placeholder="Add a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleAddReply(comment._id)}
                          disabled={submitting === `reply-${comment._id}` || !replyContent.trim()}
                        >
                          {submitting === `reply-${comment._id}` ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Posting...
                            </>
                          ) : (
                            "Post Reply"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-6 space-y-4 pl-6 border-l">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.author.image} alt={reply.author.name} />
                              <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{reply.author.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <span className="sr-only">More</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Report</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="mt-2">
                              <p>{reply.content}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(reply._id, true, comment._id)}
                                disabled={submitting === `like-${reply._id}`}
                                className={reply.userLiked ? "text-primary" : ""}
                              >
                                {submitting === `like-${reply._id}` ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                )}
                                {reply.likes}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

