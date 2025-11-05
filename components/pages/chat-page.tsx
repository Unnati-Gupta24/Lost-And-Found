"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, Search, MoreVertical } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string
    avatar: string
  }
  post: string
  lastMessage: string
  lastMessageTime: string
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  timestamp: string
}

export function ChatPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/conversations?userId=${user.id}`)
        const data = await response.json()
        setConversations(data.conversations)
        if (data.conversations.length > 0) {
          setSelectedConversation(data.conversations[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [user])

  useEffect(() => {
    if (!selectedConversation) return

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/conversations/${selectedConversation}/messages`)
        const data = await response.json()
        setMessages(data.messages)
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      }
    }

    fetchMessages()
  }, [selectedConversation])

  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation || !user) return

    try {
      const response = await fetch(`/api/conversations/${selectedConversation}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          text: messageText,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages([...messages, data.message])
        setMessageText("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full animate-fade-in">
        <p className="text-muted-foreground">Loading conversations please wait...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-background/50">
      <div className="w-80 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 border-r flex flex-col overflow-hidden">
        {/* Header */}
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/15 dark:hover:bg-black/25 transition-all duration-300 rounded-none border-b">
          <h2 className="text-xl font-bold text-foreground mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 pl-10 pr-4 py-2 rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground animate-fade-in">No conversations yet</div>
          ) : (
            filteredConversations.map((conversation, index) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full px-4 py-3 text-left border-b border-white/10 transition-all duration-300 group ${
                  selectedConversation === conversation.id
                    ? "backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 bg-blue-600/30 border-blue-500/50"
                    : "hover:backdrop-blur-md hover:bg-white/10 dark:hover:bg-black/20"
                }`}
                style={{
                  animation: `slide-up 0.6s ease-out ${index * 0.05}s backwards`,
                }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conversation.otherUser.avatar || "/placeholder.svg"}
                    alt={conversation.otherUser.name}
                    className="w-12 h-12 rounded-full animate-float shadow-lg transition-transform group-hover:scale-110"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition">
                      {conversation.otherUser.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 border-b px-6 py-4 flex items-center justify-between animate-slide-down">
              <div className="flex items-center gap-3">
                <img
                  src={currentConversation.otherUser.avatar || "/placeholder.svg"}
                  alt={currentConversation.otherUser.name}
                  className="w-10 h-10 rounded-full shadow-lg animate-float"
                />
                <div>
                  <h3 className="font-semibold text-foreground group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent">
                    {currentConversation.otherUser.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">About: {currentConversation.post}</p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-transform hover:rotate-90 hover:scale-110">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 animate-fade-in">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"} animate-slide-up`}
                  style={{
                    animationDelay: `${Math.min(index * 0.05, 0.3)}s`,
                  }}
                >
                  <div
                    className={`max-w-xs backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl px-4 py-3 backdrop-blur transition-all hover:scale-105 ${
                      message.senderId === user?.id
                        ? "bg-blue-600/80 border-blue-500/50 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white/20 dark:bg-black/30 border-white/30 dark:border-white/10 text-foreground shadow-lg"
                    }`}
                  >
                    <p className="text-sm break-words">{message.text}</p>
                    <p
                      className={`text-xs mt-2 font-medium ${
                        message.senderId === user?.id ? "text-blue-100 opacity-80" : "text-muted-foreground"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 border-t px-4 py-4 animate-slide-up">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 px-4 py-3 rounded-xl placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30 active:scale-95 bg-blue-600/80 hover:bg-blue-700/80 text-white disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full animate-fade-in">
            <p className="text-muted-foreground">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
