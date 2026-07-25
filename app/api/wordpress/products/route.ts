import { NextRequest } from 'next/server'
import { getProducts } from '@/lib/wordpress'

export async function GET(request: NextRequest) {
  try {
    const products = await getProducts()
    return Response.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
