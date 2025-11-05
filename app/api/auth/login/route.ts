import { db } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = db.users.findByEmail(email)
    if (!user || user.password !== password) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        joinedDate: user.joinedDate,
      },
    })
  } catch (error) {
    return Response.json({ error: "Login failed" }, { status: 500 })
  }
}
