import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('wp_token')?.value

  if (!token) {
    return Response.json({ session: null })
  }

  return Response.json({
    session: {
      token,
      authenticated: true,
    },
  })
}
