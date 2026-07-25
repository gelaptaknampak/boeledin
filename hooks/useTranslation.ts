import { useLanguageStore } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage)

  const t = (path: string): string => {
    return getTranslation(language, path)
  }

  return {
    t,
    language,
    setLanguage,
    toggleLanguage,
  }
}
