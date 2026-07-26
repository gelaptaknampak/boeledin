import { NextRequest } from 'next/server'
import { getPosts } from '@/lib/wordpress'

export async function GET(request: NextRequest) {
  try {
    const news = await getPosts({ per_page: 10 })
    return Response.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return Response.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
