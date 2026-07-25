import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return Response.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const wpUrl = process.env.WORDPRESS_API_URL

    if (!wpUrl) {
      return Response.json(
        { error: 'WordPress URL not configured' },
        { status: 500 }
      )
    }

    // Authenticate with WordPress
    const response = await axios.post(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
      username,
      password,
    })

    const { token, user_email, user_nicename } = response.data

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('wp_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return Response.json({
      success: true,
      user: {
        email: user_email,
        username: user_nicename,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message)
    return Response.json(
      {
        error:
          error.response?.data?.message || 'Authentication failed',
      },
      { status: 401 }
    )
  }
}
