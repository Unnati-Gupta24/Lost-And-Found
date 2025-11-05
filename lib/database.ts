// In-memory database with data persistence
interface User {
  id: string
  email: string
  password: string
  name: string
  avatar: string
  bio?: string
  joinedDate: string
}

interface Post {
  id: string
  type: "lost" | "found"
  title: string
  description: string
  image?: string
  location: string
  date: string
  authorId: string
  likes: number
  likedBy: string[]
  comments: number
  createdAt: string
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  timestamp: string
}

interface Conversation {
  id: string
  participants: string[]
  lastMessage: string
  lastMessageTime: string
  postId: string
  postTitle: string
}

interface Like {
  postId: string
  userId: string
}

// In-memory storage
const users: User[] = [
  {
    id: "demo-user",
    email: "demo@example.com",
    password: "demo123",
    name: "Demo User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    joinedDate: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
]

let posts: Post[] = [
  {
    id: "p1",
    type: "lost",
    title: "Lost Black Wallet - Downtown Area",
    description: "I lost my black leather wallet with important documents. If you find it, please contact me.",
    image: "/black-wallet-lost-downtown.jpg",
    location: "Downtown District",
    date: "2024-11-04",
    authorId: "demo-user",
    likes: 24,
    likedBy: [],
    comments: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    type: "found",
    title: "Found Golden Retriever - Blue Collar",
    description: "Found this beautiful golden retriever near the park. Has a blue collar but no tags.",
    image: "/golden-retriever-dog-found-park.jpg",
    location: "Central Park",
    date: "2024-11-03",
    authorId: "demo-user",
    likes: 156,
    likedBy: [],
    comments: 32,
    createdAt: new Date().toISOString(),
  },
]

const messages: Message[] = []
const conversations: Conversation[] = []
const likes: Like[] = []

export const db = {
  // User operations
  users: {
    findByEmail: (email: string) => users.find((u) => u.email === email),
    findById: (id: string) => users.find((u) => u.id === id),
    create: (user: User) => {
      users.push(user)
      return user
    },
    getAll: () => users,
  },

  // Post operations
  posts: {
    create: (post: Post) => {
      posts.push(post)
      return post
    },
    getAll: () => posts,
    getById: (id: string) => posts.find((p) => p.id === id),
    getByAuthor: (authorId: string) => posts.filter((p) => p.authorId === authorId),
    update: (id: string, updates: Partial<Post>) => {
      const index = posts.findIndex((p) => p.id === id)
      if (index !== -1) {
        posts[index] = { ...posts[index], ...updates }
        return posts[index]
      }
      return null
    },
    delete: (id: string) => {
      posts = posts.filter((p) => p.id !== id)
    },
  },

  // Message operations
  messages: {
    create: (message: Message) => {
      messages.push(message)
      return message
    },
    getByConversation: (conversationId: string) => messages.filter((m) => m.conversationId === conversationId),
    getAll: () => messages,
  },

  // Conversation operations
  conversations: {
    create: (conversation: Conversation) => {
      conversations.push(conversation)
      return conversation
    },
    getAll: () => conversations,
    getById: (id: string) => conversations.find((c) => c.id === id),
    update: (id: string, updates: Partial<Conversation>) => {
      const index = conversations.findIndex((c) => c.id === id)
      if (index !== -1) {
        conversations[index] = { ...conversations[index], ...updates }
        return conversations[index]
      }
      return null
    },
    getByParticipant: (userId: string) => conversations.filter((c) => c.participants.includes(userId)),
  },

  // Like operations
  likes: {
    add: (postId: string, userId: string) => {
      const post = posts.find((p) => p.id === postId)
      if (post && !post.likedBy.includes(userId)) {
        post.likedBy.push(userId)
        post.likes += 1
      }
      return post
    },
    remove: (postId: string, userId: string) => {
      const post = posts.find((p) => p.id === postId)
      if (post) {
        post.likedBy = post.likedBy.filter((id) => id !== userId)
        post.likes = Math.max(0, post.likes - 1)
      }
      return post
    },
    isLiked: (postId: string, userId: string) => {
      const post = posts.find((p) => p.id === postId)
      return post ? post.likedBy.includes(userId) : false
    },
  },
}
