import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HamburgerMenu from './HamburgerMenu'
import Sidebar from './Sidebar'
import PreferencesModal from './PreferencesModal'
import SkipLink from './SkipLink'
import styles from './Header.module.css'

function Header() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)

  return (
    <>
      <SkipLink />
      <header className={styles.header} role="banner">
        <HamburgerMenu
          isOpen={isSidebarOpen}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <h1
          className={styles.brandTitle}
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/')
            }
          }}
        >
          {t('header.title')}
        </h1>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
      />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </>
  )
}

export default Header

