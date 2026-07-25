import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from './translations'

interface LanguageStore {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'id',
      setLanguage: (lang: Language) => set({ language: lang }),
      toggleLanguage: () => {
        const current = get().language
        set({ language: current === 'en' ? 'id' : 'en' })
      },
    }),
    {
      name: 'language-store',
    }
  )
)
