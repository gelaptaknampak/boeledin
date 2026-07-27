'use client'

import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get theme from localStorage or system preference
    const stored = localStorage.getItem('boeledin-theme') as 'light' | 'dark' | null
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const current = stored || systemTheme
    setTheme(current)
    applyTheme(current)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const html = document.documentElement
    html.setAttribute('data-theme', newTheme)
    // Also add/remove dark class for compatibility
    if (newTheme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('boeledin-theme', newTheme)
    applyTheme(newTheme)
  }

  return { theme, toggleTheme, mounted }
}
