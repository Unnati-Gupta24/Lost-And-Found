import { db } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 })
    }

    const userConversations = db.conversations.getByParticipant(userId)

    return Response.json({
      conversations: userConversations.map((conv) => {
        const otherUserId = conv.participants.find((id) => id !== userId)
        const otherUser = db.users.findById(otherUserId || "")

        return {
          id: conv.id,
          otherUser: {
            id: otherUser?.id,
            name: otherUser?.name,
            avatar: otherUser?.avatar,
          },
          post: conv.postTitle,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
        }
      }),
    })
  } catch (error) {
    return Response.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId1, userId2, postId, postTitle } = await request.json()

    const existingConv = db.conversations
      .getAll()
      .find((c) => c.participants.includes(userId1) && c.participants.includes(userId2) && c.postId === postId)

    if (existingConv) {
      return Response.json({ conversation: existingConv })
    }

    const newConversation = {
      id: `conv-${Date.now()}`,
      participants: [userId1, userId2],
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      postId,
      postTitle,
    }

    const created = db.conversations.create(newConversation)
    return Response.json({ conversation: created })
  } catch (error) {
    return Response.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}
