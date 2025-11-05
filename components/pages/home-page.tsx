"use client"

import { useState, useEffect, useMemo } from "react"
import { Heart, MessageCircle, Share2, MapPin, Calendar } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Post {
  id: string
  type: "lost" | "found"
  title: string
  description: string
  image?: string
  location: string
  date: string
  author: {
    id: string
    name: string
    avatar: string
    location: string
  }
  likes: number
  likedBy: string[]
  comments: number
}

export function HomePage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all")
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts")
        const data = await response.json()
        setPosts(data.posts)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (filter === "all") return true
      return post.type === filter
    })
  }, [posts, filter])

  const toggleLike = async (postId: string) => {
    if (!user) return

    try {
      const isLiked = posts.find((p) => p.id === postId)?.likedBy.includes(user.id)

      if (isLiked) {
        await fetch(`/api/posts/${postId}/like`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        })
      } else {
        await fetch(`/api/posts/${postId}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        })
      }

      const response = await fetch("/api/posts")
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error("Failed to toggle like:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground animate-fade-in">Loading posts...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background/50">
      <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 border-b sticky top-0 z-20 px-6 py-4 animate-slide-down">
        <h2 className="text-2xl font-bold text-foreground mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Lost & Found Feed
        </h2>
        <div className="flex gap-2">
          {(["all", "lost", "found"] as const).map((type, index) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30 active:scale-95 text-sm ${
                filter === type
                  ? "bg-blue-600/80 dark:bg-blue-600/60 text-white border-blue-500"
                  : "text-foreground hover:text-white"
              }`}
              style={{
                animation: `slide-up 0.6s ease-out ${index * 0.1}s backwards`,
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/15 dark:hover:bg-black/25 transition-all duration-300 animate-fade-in hover:scale-105 group"
              style={{
                animation: `slide-up 0.6s ease-out ${(index % 3) * 0.1}s backwards`,
              }}
            >
              {/* Post Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full animate-float shadow-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition">
                    {post.author.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{post.author.location}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur transition ${
                    post.type === "lost"
                      ? "bg-red-500/30 border border-red-500/50 text-red-700 dark:text-red-300"
                      : "bg-emerald-500/30 border border-emerald-500/50 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  {post.type.toUpperCase()}
                </span>
              </div>

              {/* Post Content */}
              <h4 className="text-lg font-bold text-foreground mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition">
                {post.title}
              </h4>
              <p className="text-muted-foreground mb-4">{post.description}</p>

              {/* Post Image */}
              {post.image && (
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-72 object-cover rounded-xl mb-4 transition-transform duration-300 group-hover:scale-105"
                />
              )}

              {/* Post Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 px-2 py-2 rounded-lg bg-white/5 dark:bg-black/20">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {post.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex gap-4 pt-4 border-t border-white/10 dark:border-white/5">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 group/btn ${
                    user && post.likedBy.includes(user.id)
                      ? "text-red-600 dark:text-red-400 bg-red-500/20 backdrop-blur scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-black/20"
                  }`}
                >
                  <Heart
                    className="w-5 h-5 transition-transform group-hover/btn:scale-110"
                    fill={user && post.likedBy.includes(user.id) ? "currentColor" : "none"}
                  />
                  <span className="font-semibold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground rounded-lg font-medium transition-all duration-300 hover:bg-white/10 dark:hover:bg-black/20">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground rounded-lg font-medium transition-all duration-300 hover:bg-white/10 dark:hover:bg-black/20">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
