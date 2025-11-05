import { db } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id
    const messages = db.messages.getByConversation(conversationId)

    return Response.json({ messages })
  } catch (error) {
    return Response.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id
    const { senderId, text } = await request.json()

    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      text,
      timestamp: new Date().toISOString(),
    }

    db.messages.create(newMessage)

    const conversation = db.conversations.getById(conversationId)
    if (conversation) {
      db.conversations.update(conversationId, {
        lastMessage: text,
        lastMessageTime: new Date().toISOString(),
      })
    }

    return Response.json({ message: newMessage })
  } catch (error) {
    return Response.json({ error: "Failed to send message" }, { status: 500 })
  }
}
