"use client"

import { useState } from "react"
import { Navigation } from "./navigation"
import { HomePage } from "@/components/pages/home-page"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { CreatePostPage } from "@/components/pages/create-post-page"
import { ParticleBackground } from "@/components/ui/particle-background"
import ChatPage from "../pages/chat-page"

type Page = "home" | "dashboard" | "create" | "chat"

export function MainLayout() {
  const [currentPage, setCurrentPage] = useState<Page>("home")

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      <ParticleBackground />

      <div className="relative z-10 flex h-full w-full">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="flex-1 overflow-hidden">
          {currentPage === "home" && <HomePage />}
          {currentPage === "dashboard" && <DashboardPage />}
          {currentPage === "create" && <CreatePostPage />}
          {currentPage === "chat" && <ChatPage />}
        </main>
      </div>
    </div>
  )
}
