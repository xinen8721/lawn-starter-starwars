import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '../hooks'
import { useFocusTrap } from '../hooks'
import { Theme, SupportedLanguage } from '../constants'
import styles from './PreferencesModal.module.css'

interface PreferencesModalProps {
  isOpen: boolean
  onClose: () => void
}

function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const { t } = useTranslation()
  const { theme, language, setTheme, setLanguage } = usePreferences()
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  // Use focus trap hook
  useFocusTrap(modalRef, isOpen, onClose)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previouslyFocused.current = document.activeElement as HTMLElement

      // Focus close button when modal opens
      closeButtonRef.current?.focus()
    } else if (previouslyFocused.current) {
      // Restore focus when modal closes
      previouslyFocused.current.focus()
      previouslyFocused.current = null
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preferences-title"
      >
        <div className={styles.header}>
          <h2 id="preferences-title" className={styles.title}>{t('preferences.title')}</h2>
          <button
            ref={closeButtonRef}
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t('preferences.close')}
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <label htmlFor="language-select" className={styles.label}>
              {t('preferences.language')}
            </label>
            <select
              id="language-select"
              className={styles.select}
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ja">日本語</option>
              <option value="zh">简体中文</option>
            </select>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>{t('preferences.theme')}</label>
            <div className={styles.themeButtons} role="group" aria-label={t('preferences.theme')}>
              <button
                className={`${styles.themeButton} ${theme === 'light' ? styles.active : ''}`}
                onClick={() => handleThemeChange('light')}
                aria-pressed={theme === 'light'}
              >
                {t('preferences.light')}
              </button>
              <button
                className={`${styles.themeButton} ${theme === 'dark' ? styles.active : ''}`}
                onClick={() => handleThemeChange('dark')}
                aria-pressed={theme === 'dark'}
              >
                {t('preferences.dark')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreferencesModal

