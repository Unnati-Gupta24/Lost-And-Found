import { db } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (db.users.findByEmail(email)) {
      return Response.json({ error: "User already exists" }, { status: 400 })
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      joinedDate: new Date().toISOString(),
    }

    const created = db.users.create(newUser)

    return Response.json({
      user: {
        id: created.id,
        email: created.email,
        name: created.name,
        avatar: created.avatar,
        joinedDate: created.joinedDate,
      },
    })
  } catch (error) {
    return Response.json({ error: "Signup failed" }, { status: 500 })
  }
}
