import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Send, Search, MoreVertical, Wifi, WifiOff } from "lucide-react";

// ====================
// Types
// ====================

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Conversation {
  id: string;
  otherUser: User;
  post: string;
  lastMessage: string;
  lastMessageTime: string;
  participants: string[];
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  text: string;
  timestamp: string;
}

interface WebSocketMessage {
  type: "message" | "delivered";
  data: Message;
}

// ====================
// Mock Data
// ====================

const CURRENT_USER: User = {
  id: "user-1",
  name: "You",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
};

const USERS: User[] = [
  { id: "user-2", name: "Sarah Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: "user-3", name: "Mike Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
  { id: "user-4", name: "Emma Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    otherUser: USERS[0],
    post: "iPhone 13 for Sale",
    lastMessage: "Is it still available?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    participants: [CURRENT_USER.id, USERS[0].id],
  },
  {
    id: "conv-2",
    otherUser: USERS[1],
    post: "Gaming Laptop",
    lastMessage: "Can we meet tomorrow?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    participants: [CURRENT_USER.id, USERS[1].id],
  },
  {
    id: "conv-3",
    otherUser: USERS[2],
    post: "Mountain Bike",
    lastMessage: "Thanks for the info!",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    participants: [CURRENT_USER.id, USERS[2].id],
  },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    { id: "msg-1", conversationId: "conv-1", senderId: USERS[0].id, text: "Hi! I'm interested in the iPhone 13", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: "msg-2", conversationId: "conv-1", senderId: CURRENT_USER.id, text: "Hello! Yes, it’s in great condition", timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
    { id: "msg-3", conversationId: "conv-1", senderId: USERS[0].id, text: "Is it still available?", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  ],
  "conv-2": [
    { id: "msg-4", conversationId: "conv-2", senderId: USERS[1].id, text: "Hey, what's the spec on the gaming laptop?", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: "msg-5", conversationId: "conv-2", senderId: CURRENT_USER.id, text: "RTX 3070, 16GB RAM, i7 processor", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: "msg-6", conversationId: "conv-2", senderId: USERS[1].id, text: "Perfect! Can we meet tomorrow?", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  ],
  "conv-3": [
    { id: "msg-7", conversationId: "conv-3", senderId: USERS[2].id, text: "Is the mountain bike frame size medium?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    { id: "msg-8", conversationId: "conv-3", senderId: CURRENT_USER.id, text: "Yes, it’s a medium frame. 27.5 inch wheels", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString() },
    { id: "msg-9", conversationId: "conv-3", senderId: USERS[2].id, text: "Thanks for the info!", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  ],
};

// ====================
// Mock WebSocket
// ====================

class MockWebSocket {
  url: string;
  readyState: number;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    this.readyState = 0; // CONNECTING

    setTimeout(() => {
      this.readyState = 1; // OPEN
      this.onopen?.(new Event("open"));
    }, 500);
  }

  send(data: string) {
    setTimeout(() => {
      this.onmessage?.(
        new MessageEvent("message", {
          data: JSON.stringify({ type: "delivered", data: JSON.parse(data) }),
        })
      );
    }, 200);

    // Simulate random incoming message
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const responses = [
          "That sounds good!",
          "Let me check and get back to you",
          "Sure, I’m available",
          "Can you send me more details?",
          "Perfect, thanks!",
        ];
        const parsedData: Message = JSON.parse(data);
        const newMessage: Message = {
          id: `msg-${Date.now()}-${Math.random()}`,
          conversationId: parsedData.conversationId,
          senderId: parsedData.receiverId!,
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toISOString(),
        };
        this.onmessage?.(
          new MessageEvent("message", {
            data: JSON.stringify({ type: "message", data: newMessage }),
          })
        );
      }, 2000 + Math.random() * 3000);
    }
  }

  close() {
    this.readyState = 3; // CLOSED
    this.onclose?.(new Event("close"));
  }
}

// ====================
// ChatPage Component
// ====================

export default function ChatPage(): JSX.Element {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [messageText, setMessageText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const wsRef = useRef<MockWebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize WebSocket
  useEffect(() => {
    const ws = new MockWebSocket("wss://demo-chat-server.com/ws");

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const { type, data }: WebSocketMessage = JSON.parse(event.data);
      if (type === "message") {
        setMessages((prev) => ({
          ...prev,
          [data.conversationId]: [...(prev[data.conversationId] || []), data],
        }));
        setConversations((prev) =>
          prev.map((c) =>
            c.id === data.conversationId
              ? { ...c, lastMessage: data.text, lastMessageTime: data.timestamp }
              : c
          )
        );
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    wsRef.current = ws;
    return () => ws.close();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConversation]);

  const currentConversation = conversations.find((c) => c.id === selectedConversation);
  const currentMessages = messages[selectedConversation] || [];

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation || !isConnected || !currentConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation,
      senderId: CURRENT_USER.id,
      receiverId: currentConversation.otherUser.id,
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation
          ? { ...c, lastMessage: messageText, lastMessageTime: newMessage.timestamp }
          : c
      )
    );

    wsRef.current?.send(JSON.stringify(newMessage));
    setMessageText("");
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // ====================
  // JSX
  // ====================

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* SIDEBAR */}
      <div className="w-80 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-r border-white/20 dark:border-white/10 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/20 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Messages
            </h2>
            {isConnected ? <Wifi className="text-green-500 w-5 h-5" /> : <WifiOff className="text-red-500 animate-pulse w-5 h-5" />}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-white/10 pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full px-4 py-4 text-left border-b border-white/10 hover:bg-white/30 dark:hover:bg-slate-800/30 transition ${
                selectedConversation === conversation.id ? "bg-blue-500/20 border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={conversation.otherUser.avatar} className="w-12 h-12 rounded-full ring-2 ring-white/50" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{conversation.otherUser.name}</h3>
                    <span className="text-xs text-slate-500">{formatTime(conversation.lastMessageTime)}</span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{conversation.lastMessage}</p>
                  <p className="text-xs text-blue-600 truncate">Re: {conversation.post}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <img src={currentConversation.otherUser.avatar} className="w-12 h-12 rounded-full ring-2 ring-white/50" />
                <div>
                  <h3 className="font-semibold text-lg">{currentConversation.otherUser.name}</h3>
                  <p className="text-sm text-slate-600">About: {currentConversation.post}</p>
                </div>
              </div>
              <MoreVertical className="w-5 h-5 text-slate-500 hover:text-slate-800 cursor-pointer" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === CURRENT_USER.id ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-md rounded-2xl px-4 py-3 shadow-lg ${
                      msg.senderId === CURRENT_USER.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-white/80 dark:bg-slate-800/80 border border-white/30 text-slate-900 dark:text-white"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex gap-3 px-6 py-4 bg-white/60 dark:bg-slate-900/60 border-t backdrop-blur-xl">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                disabled={!isConnected}
                className="flex-1 px-4 py-3 rounded-xl border border-white/30 bg-white/60 dark:bg-slate-800/60 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!messageText.trim() || !isConnected}
                className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
