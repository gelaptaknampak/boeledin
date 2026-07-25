import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import axios from 'axios'

async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('wp_token')?.value
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wpUrl = process.env.WORDPRESS_API_URL
    const { title, content, excerpt, image, category } = await request.json()

    const response = await axios.post(
      `${wpUrl}/wp-json/wp/v2/posts`,
      {
        title,
        content,
        excerpt,
        status: 'publish',
        categories: category,
        featured_media: image,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return Response.json(response.data)
  } catch (error: any) {
    console.error('Error creating news:', error.response?.data || error.message)
    return Response.json(
      { error: error.response?.data?.message || 'Failed to create news' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wpUrl = process.env.WORDPRESS_API_URL
    const { id, title, content, excerpt, image, category } = await request.json()

    const response = await axios.post(
      `${wpUrl}/wp-json/wp/v2/posts/${id}`,
      {
        title,
        content,
        excerpt,
        categories: category,
        featured_media: image,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return Response.json(response.data)
  } catch (error: any) {
    console.error('Error updating news:', error.response?.data || error.message)
    return Response.json(
      { error: error.response?.data?.message || 'Failed to update news' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const wpUrl = process.env.WORDPRESS_API_URL
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Post ID required' }, { status: 400 })
    }

    await axios.delete(`${wpUrl}/wp-json/wp/v2/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting news:', error.response?.data || error.message)
    return Response.json(
      { error: error.response?.data?.message || 'Failed to delete news' },
      { status: error.response?.status || 500 }
    )
  }
}
