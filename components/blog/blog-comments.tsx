"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, Reply, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

// This would typically come from an API
const initialComments = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=40&width=40",
    },
    content:
      "This is a great article! I've been trying to decide between Next.js and React for my new project, and this really helped clarify things.",
    date: "2 days ago",
    likes: 5,
    replies: [
      {
        id: "1-1",
        author: {
          name: "Kamruz",
          image: "/placeholder.svg?height=40&width=40",
        },
        content: "Thanks Sarah! I'm glad you found it helpful. Let me know if you have any other questions.",
        date: "1 day ago",
        likes: 2,
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Michael Chen",
      image: "/placeholder.svg?height=40&width=40",
    },
    content:
      "I've been using Next.js for a while now and can confirm all the points you made. The server-side rendering has been a game-changer for our SEO.",
    date: "3 days ago",
    likes: 8,
    replies: [],
  },
]

interface Comment {
  id: string
  author: {
    name: string
    image: string
  }
  content: string
  date: string
  likes: number
  replies?: Comment[]
}

interface BlogCommentsProps {
  postSlug: string
}

export default function BlogComments({ postSlug }: BlogCommentsProps) {
  // Use next-auth session instead of custom useAuth hook
  const { data: session } = useSession()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleAddComment = () => {
    if (!session) {
      toast({
        title: "Login required",
        description: "Please log in to add a comment",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: session.user.name || "Anonymous",
        image: session.user.image || "/placeholder.svg?height=40&width=40",
      },
      content: newComment,
      date: "Just now",
      likes: 0,
      replies: [],
    }

    setComments([comment, ...comments])
    setNewComment("")

    toast({
      title: "Comment added",
      description: "Your comment has been added successfully",
    })
  }

  const handleAddReply = (commentId: string) => {
    if (!session) {
      toast({
        title: "Login required",
        description: "Please log in to add a reply",
        variant: "destructive",
      })
      return
    }

    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: {
        name: session.user.name || "Anonymous",
        image: session.user.image || "/placeholder.svg?height=40&width=40",
      },
      content: replyContent,
      date: "Just now",
      likes: 0,
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        }
      }
      return comment
    })

    setComments(updatedComments)
    setReplyingTo(null)
    setReplyContent("")

    toast({
      title: "Reply added",
      description: "Your reply has been added successfully",
    })
  }

  const handleLike = (commentId: string, isReply = false, parentId?: string) => {
    if (!session) {
      toast({
        title: "Login required",
        description: "Please log in to like a comment",
        variant: "destructive",
      })
      return
    }

    if (isReply && parentId) {
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          const updatedReplies = comment.replies?.map((reply) => {
            if (reply.id === commentId) {
              return { ...reply, likes: reply.likes + 1 }
            }
            return reply
          })
          return { ...comment, replies: updatedReplies }
        }
        return comment
      })
      setComments(updatedComments)
    } else {
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 }
        }
        return comment
      })
      setComments(updatedComments)
    }
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
            <Button onClick={handleAddComment}>Post Comment</Button>
          </div>
        </div>
      ) : (
        <div className="bg-muted p-4 rounded-lg mb-8 text-center">
          <p className="mb-2">Please log in to add a comment</p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-8">
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
                    <p className="text-xs text-muted-foreground">{comment.date}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
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
                  <Button variant="ghost" size="sm" onClick={() => handleLike(comment.id)}>
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {comment.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                </div>

                {replyingTo === comment.id && (
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
                      <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                        Post Reply
                      </Button>
                    </div>
                  </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-6 space-y-4 pl-6 border-l">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-4">
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
                              <p className="text-xs text-muted-foreground">{reply.date}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More</span>
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
                            <Button variant="ghost" size="sm" onClick={() => handleLike(reply.id, true, comment.id)}>
                              <ThumbsUp className="h-4 w-4 mr-1" />
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
        ))}
      </div>
    </div>
  )
}

