import { db } from "@/lib/database"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const postId = params.id

    const post = db.likes.add(postId, userId)
    return Response.json({ post })
  } catch (error) {
    return Response.json({ error: "Failed to like post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const postId = params.id

    const post = db.likes.remove(postId, userId)
    return Response.json({ post })
  } catch (error) {
    return Response.json({ error: "Failed to unlike post" }, { status: 500 })
  }
}
