export const APP_NAME = 'SWStarter'

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'ja', 'zh'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

export const THEMES = ['light', 'dark'] as const
export type Theme = typeof THEMES[number]

export const DEFAULT_THEME: Theme = 'light'

// Use environment variable or fallback to localhost
// Default for test/dev environment
let apiUrl = 'http://localhost:8000'

// In production/Vite environment, use import.meta
if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
  try {
    // @ts-ignore - import.meta is defined at runtime by Vite
    apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:8000'
  } catch (e) {
    // Fallback already set
  }
}

export const API_BASE_URL = apiUrl

