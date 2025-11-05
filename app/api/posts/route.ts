import { db } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const authorId = searchParams.get("authorId")

    let allPosts = db.posts.getAll()
    if (authorId) {
      allPosts = db.posts.getByAuthor(authorId)
    }

    return Response.json({
      posts: allPosts.map((post) => {
        const author = db.users.findById(post.authorId)
        return {
          ...post,
          author: {
            id: author?.id,
            name: author?.name,
            avatar: author?.avatar,
            location: post.location,
          },
        }
      }),
    })
  } catch (error) {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { type, title, description, location, date, image, authorId } = await request.json()

    const newPost = {
      id: `post-${Date.now()}`,
      type,
      title,
      description,
      image,
      location,
      date,
      authorId,
      likes: 0,
      likedBy: [],
      comments: 0,
      createdAt: new Date().toISOString(),
    }

    const created = db.posts.create(newPost)
    const author = db.users.findById(created.authorId)

    return Response.json({
      post: {
        ...created,
        author: {
          id: author?.id,
          name: author?.name,
          avatar: author?.avatar,
          location: created.location,
        },
      },
    })
  } catch (error) {
    return Response.json({ error: "Failed to create post" }, { status: 500 })
  }
}
