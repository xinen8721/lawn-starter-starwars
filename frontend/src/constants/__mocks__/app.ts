// Mock for tests - avoids import.meta issues
export const APP_NAME = 'SWStarter'

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'ja', 'zh'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

export const THEMES = ['light', 'dark'] as const
export type Theme = typeof THEMES[number]

export const DEFAULT_THEME: Theme = 'light'

export const API_BASE_URL = 'http://localhost:8000'

