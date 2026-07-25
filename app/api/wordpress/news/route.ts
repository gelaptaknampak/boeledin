import { NextRequest } from 'next/server'
import { getNews } from '@/lib/wordpress'

export async function GET(request: NextRequest) {
  try {
    const news = await getNews()
    return Response.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return Response.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
