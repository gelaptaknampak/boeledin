'use client'

import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-center" />
    </SessionProvider>
  )
}
