import { NextRequest } from 'next/server'
import { getPages } from '@/lib/wordpress'

export async function GET(request: NextRequest) {
  try {
    const lang = request.nextUrl.searchParams.get('lang') || 'id'
    const pages = await getPages(undefined, lang as any)
    return Response.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return Response.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}
