"use client"

import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { Heart, MapPin, Calendar, MessageCircle, MoreVertical } from "lucide-react"

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
  comments: number
}

export function DashboardPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all")
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`/api/posts?authorId=${user.id}`)
        const data = await response.json()
        setUserPosts(data.posts)
      } catch (error) {
        console.error("Failed to fetch user posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserPosts()
  }, [user])

  const filteredPosts = userPosts.filter((post) => {
    if (filter === "all") return true
    return post.type === filter
  })

  if (!user) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>
  }

  return (
    <div className="flex flex-col h-full bg-background/50 overflow-y-auto">
      <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 border-b sticky top-0 z-20 animate-slide-down">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start gap-6 mb-8 animate-fade-in">
            <img
              src={user?.avatar || "/placeholder.svg"}
              alt={user?.name}
              className="w-24 h-24 rounded-full border-4 border-blue-500/50 shadow-lg animate-float"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {user?.name}
              </h1>
              <p className="text-muted-foreground mb-4">{user?.email}</p>
              <div className="flex gap-6 text-sm">
                <div
                  className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg px-4 py-2 animate-scale-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <p className="font-semibold text-foreground">{filteredPosts.length}</p>
                  <p className="text-muted-foreground text-xs">Posts</p>
                </div>
                <div
                  className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg px-4 py-2 animate-scale-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <p className="font-semibold text-foreground">
                    {filteredPosts.reduce((sum, post) => sum + post.likes, 0)}
                  </p>
                  <p className="text-muted-foreground text-xs">Total Likes</p>
                </div>
                <div
                  className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg px-4 py-2 animate-scale-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <p className="font-semibold text-foreground">
                    {new Date(user?.joinedDate || "").toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-muted-foreground text-xs">Joined</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-white/10 pt-4">
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
      </div>

      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No posts yet</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/15 dark:hover:bg-black/25 transition-all duration-300 flex gap-4 overflow-hidden group hover:scale-105"
                  style={{
                    animation: `slide-up 0.6s ease-out ${(index % 3) * 0.1}s backwards`,
                  }}
                >
                  {post.image && (
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-40 h-40 object-cover flex-shrink-0 transition-transform group-hover:scale-110"
                    />
                  )}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-foreground group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition">
                        {post.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 backdrop-blur ${
                          post.type === "lost"
                            ? "bg-red-500/30 border border-red-500/50 text-red-700 dark:text-red-300"
                            : "bg-emerald-500/30 border border-emerald-500/50 text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        {post.type.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-3">{post.description}</p>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4 px-2 py-2 rounded-lg bg-white/5 dark:bg-black/20">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {post.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2 border-t border-white/10">
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-all hover:scale-110">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-all hover:scale-110">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                      <button className="ml-auto text-muted-foreground hover:text-foreground transition-transform hover:rotate-90">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
