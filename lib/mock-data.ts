export interface Post {
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

export interface Conversation {
  id: string
  otherUser: {
    name: string
    avatar: string
  }
  post: string
  lastMessage: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  timestamp: string
}

export const mockPosts: Post[] = [
  {
    id: "1",
    type: "lost",
    title: "Lost Black Wallet - Downtown Area",
    description:
      "I lost my black leather wallet with important documents. If you find it, please contact me immediately. Contains ID and credit cards.",
    image: "/black-wallet-lost-downtown.jpg",
    location: "Downtown District",
    date: "2024-11-04",
    author: {
      id: "u1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      location: "Downtown",
    },
    likes: 24,
    comments: 8,
  },
  {
    id: "2",
    type: "found",
    title: "Found Golden Retriever - Blue Collar",
    description:
      "Found this beautiful golden retriever near the park. Has a blue collar but no tags. Very friendly and well-behaved. Please contact if this is your dog.",
    image: "/golden-retriever-dog-found-park.jpg",
    location: "Central Park",
    date: "2024-11-03",
    author: {
      id: "u2",
      name: "Mike Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      location: "Central Park",
    },
    likes: 156,
    comments: 32,
  },
  {
    id: "3",
    type: "lost",
    title: "Lost Silver Wedding Ring",
    description:
      "Lost my grandmother's precious silver wedding ring with diamond. Lost on the beach. Very sentimental value. Large reward offered.",
    image: "/silver-wedding-ring-diamond-beach.jpg",
    location: "Sunny Beach",
    date: "2024-11-02",
    author: {
      id: "u3",
      name: "Emma Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      location: "Beach Area",
    },
    likes: 89,
    comments: 15,
  },
  {
    id: "4",
    type: "found",
    title: "Found Set of Keys - Shopping Center",
    description:
      "Found a set of keys with blue keychain at the shopping mall. Has car and house keys. Please describe and I can return them.",
    image: "/set-of-keys-blue-keychain-shopping-mall.jpg",
    location: "Westside Shopping Center",
    date: "2024-11-01",
    author: {
      id: "u4",
      name: "Alex Park",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      location: "Shopping Center",
    },
    likes: 42,
    comments: 10,
  },
]

export const mockUserPosts: Post[] = [
  {
    id: "up1",
    type: "lost",
    title: "Lost AirPods Pro",
    description: "Lost my AirPods Pro in their white charging case. Last seen at the gym. If found, please contact me.",
    image: "/airpods-pro-white-charging-case-lost-gym.jpg",
    location: "Fitness Hub Gym",
    date: "2024-10-28",
    author: {
      id: "current",
      name: "Current User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=current",
      location: "Downtown",
    },
    likes: 18,
    comments: 5,
  },
  {
    id: "up2",
    type: "found",
    title: "Found Cat - Orange Tabby",
    description:
      "Found this cute orange tabby cat in my neighborhood. Very friendly and seems domesticated. Looking for the owner.",
    image: "/orange-tabby-cat-found-neighborhood.jpg",
    location: "Residential Area",
    date: "2024-10-25",
    author: {
      id: "current",
      name: "Current User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=current",
      location: "Downtown",
    },
    likes: 67,
    comments: 12,
  },
]

export const mockConversations: Conversation[] = [
  {
    id: "c1",
    otherUser: {
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    post: "Black Wallet Lost",
    lastMessage: "I found it! Can we meet tomorrow?",
  },
  {
    id: "c2",
    otherUser: {
      name: "Mike Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
    post: "Golden Retriever Found",
    lastMessage: "Yes! That's my dog! Thank you so much!",
  },
  {
    id: "c3",
    otherUser: {
      name: "Emma Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    },
    post: "Silver Wedding Ring Lost",
    lastMessage: "Still looking, will update you soon",
  },
]

export const mockMessages = [
  {
    id: "m1",
    conversationId: "c1",
    senderId: "other",
    text: "Hi! I think I found your wallet!",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "m2",
    conversationId: "c1",
    senderId: "current-user",
    text: "Really?! That's amazing! Where did you find it?",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: "m3",
    conversationId: "c1",
    senderId: "other",
    text: "I found it! Can we meet tomorrow?",
    timestamp: new Date(Date.now() - 3400000).toISOString(),
  },
  {
    id: "m4",
    conversationId: "c2",
    senderId: "other",
    text: "I have your dog! She's safe and sound",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "m5",
    conversationId: "c2",
    senderId: "current-user",
    text: "Oh my god, thank you! Can I come pick her up?",
    timestamp: new Date(Date.now() - 7100000).toISOString(),
  },
  {
    id: "m6",
    conversationId: "c2",
    senderId: "other",
    text: "Yes! That's my dog! Thank you so much!",
    timestamp: new Date(Date.now() - 7000000).toISOString(),
  },
]
