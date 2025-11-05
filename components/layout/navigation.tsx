"use client"

import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { Heart, Home, Plus, MessageCircle, User, LogOut, Moon, Sun } from "lucide-react"

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: any) => void
}

export function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const isActive = (page: string) =>
    currentPage === page
      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105"
      : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-black/20"

  return (
    <div className="w-64 backdrop-blur-md bg-white/10 dark:bg-black/20 border border-r border-white/20 dark:border-white/10 flex flex-col overflow-y-auto">
      <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-white/15 dark:hover:bg-black/25 transition-all duration-300 border-b rounded-none animate-slide-down">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/40 animate-float">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-foreground bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lost & Found
            </h1>
            <p className="text-xs text-muted-foreground">Community</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {[
          { icon: Home, label: "Feed", page: "home" },
          { icon: Plus, label: "New Post", page: "create" },
          { icon: MessageCircle, label: "Messages", page: "chat" },
          { icon: User, label: "Profile", page: "dashboard" },
        ].map(({ icon: Icon, label, page }, index) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive(page)}`}
            style={{
              animation: `slide-in 0.6s ease-out ${index * 0.1}s backwards`,
            }}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-3 border-t border-white/10">
        <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl px-4 py-3 animate-fade-in">
          <img
            src={user?.avatar || "/placeholder.svg"}
            alt={user?.name}
            className="w-10 h-10 rounded-full mb-2 animate-float"
          />
          <p className="font-semibold text-foreground truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30 active:scale-95 flex items-center gap-3 px-4 py-2 text-foreground hover:text-white transition-all duration-300 group"
        >
          {theme === "light" ? (
            <>
              <Moon className="w-5 h-5 group-hover:scale-110 transition" />
              <span className="text-sm">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-5 h-5 group-hover:scale-110 transition" />
              <span className="text-sm">Light Mode</span>
            </>
          )}
        </button>

        <button
          onClick={logout}
          className="w-full backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/30 active:scale-95 flex items-center gap-3 px-4 py-2 text-red-500 hover:text-red-400 hover:bg-red-500/20 transition-all duration-300 active:scale-95"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
