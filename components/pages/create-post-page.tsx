"use client"

import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function CreatePostPage() {
  const { user } = useAuth()
  const [postType, setPostType] = useState<"lost" | "found">("lost")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: postType,
          title,
          description,
          location,
          date,
          image,
          authorId: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      setTitle("")
      setDescription("")
      setLocation("")
      setDate("")
      setImage(null)
      alert("Post created successfully!")
    } catch (err) {
      setError("Failed to create post. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background/50 overflow-y-auto">
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 animate-slide-up">
        <h2 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create a Post
        </h2>
        <p className="text-muted-foreground mb-8">Share details about your lost or found item with the community</p>

        {error && (
          <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 border-red-500/50 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 animate-scale-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type Selection */}
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <label className="block text-sm font-semibold text-foreground mb-4">What would you like to post?</label>
            <div className="grid grid-cols-2 gap-4">
              {(["lost", "found"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPostType(type)}
                  type="button"
                  className={`backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/15 dark:hover:bg-black/25 transition-all duration-300 text-left ${
                    postType === type
                      ? "border-blue-500/80 bg-blue-600/40 scale-105"
                      : "hover:border-blue-500/50 hover:bg-blue-500/20"
                  }`}
                >
                  <p className="font-semibold text-foreground capitalize mb-1">
                    {type === "lost" ? "Lost Item" : "Found Item"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {type === "lost" ? "Help find something I lost" : "Help return something I found"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <label className="block text-sm font-semibold text-foreground mb-3">Add Image</label>
            <div className="relative">
              {image ? (
                <div className="relative animate-scale-in">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                  <button
                    onClick={() => setImage(null)}
                    type="button"
                    className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-full backdrop-blur transition hover:scale-110 active:scale-95"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/15 dark:hover:bg-black/25 transition-all duration-300 text-center cursor-pointer border-dashed border-2 group transition hover:scale-105">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-3 group-hover:scale-125 transition" />
                  <p className="font-semibold text-foreground">Add a photo</p>
                  <p className="text-sm text-muted-foreground">Upload an image to help identify the item</p>
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Black Wallet Lost Near Park"
              className="w-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 px-4 py-3 rounded-xl placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Description */}
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed description of the item..."
              rows={4}
              className="w-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 px-4 py-3 rounded-xl placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              required
            />
          </div>

          {/* Location */}
          <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Central Park, Downtown Area"
              className="w-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 px-4 py-3 rounded-xl placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Date */}
          <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <label className="block text-sm font-semibold text-foreground mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !title || !description || !location || !date}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed animate-glow-pulse active:scale-95 animate-slide-up"
            style={{ animationDelay: "0.7s" }}
          >
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  )
}
