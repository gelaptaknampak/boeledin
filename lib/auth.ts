import { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import axios from 'axios'

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost/wordpress'

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'WordPress',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // Authenticate with WordPress
          const response = await axios.post(
            `${WORDPRESS_URL}/wp-json/jwt-auth/v1/token`,
            {
              username: credentials.username,
              password: credentials.password,
            }
          )

          if (response.data.token) {
            const user = {
              id: response.data.user_id.toString(),
              name: response.data.user_nicename,
              email: response.data.user_email,
              token: response.data.token,
            }
            return user
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        (session as any).accessToken = token.accessToken
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
