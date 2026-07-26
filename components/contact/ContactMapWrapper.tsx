'use client'

import dynamic from 'next/dynamic'

const ContactMap = dynamic(() => import('./ContactMap'), {
  ssr: false,
  loading: () => <div className="w-full h-64 md:h-80 bg-slate-200 rounded-lg animate-pulse" />,
})

export default function ContactMapWrapper() {
  return <ContactMap />
}
