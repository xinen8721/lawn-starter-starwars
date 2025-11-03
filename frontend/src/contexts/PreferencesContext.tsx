import { createContext, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Theme, SupportedLanguage, DEFAULT_THEME, DEFAULT_LANGUAGE, STORAGE_KEYS } from '../constants'

interface PreferencesContextType {
  theme: Theme
  language: SupportedLanguage
  setTheme: (theme: Theme) => void
  setLanguage: (language: SupportedLanguage) => void
}

export const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [theme, setThemeState] = useLocalStorage<Theme>(STORAGE_KEYS.THEME, DEFAULT_THEME)
  const [language, setLanguageState] = useLocalStorage<SupportedLanguage>(
    STORAGE_KEYS.LANGUAGE,
    DEFAULT_LANGUAGE
  )

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    document.body.className = newTheme === 'dark' ? 'dark-theme' : ''
  }

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage)
    i18n.changeLanguage(newLanguage)
  }

  useEffect(() => {
    // Apply theme on mount
    document.body.className = theme === 'dark' ? 'dark-theme' : ''
    // Apply language on mount
    i18n.changeLanguage(language)
  }, [])

  return (
    <PreferencesContext.Provider value={{ theme, language, setTheme, setLanguage }}>
      {children}
    </PreferencesContext.Provider>
  )
}


