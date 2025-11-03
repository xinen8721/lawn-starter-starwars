import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import fr from './locales/fr.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  ja: { translation: ja },
  zh: { translation: zh },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (typeof window !== 'undefined' ? localStorage.getItem('language') : null) || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

