import { NextRequest } from 'next/server'
import { getCustomPosts } from '@/lib/wordpress'

export async function GET(request: NextRequest) {
  try {
    const products = await getCustomPosts('product', { per_page: 12 })
    return Response.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
