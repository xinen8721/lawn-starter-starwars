import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useFocusTrap } from '../hooks'
import { focusFirstElement } from '../utils'
import styles from './Sidebar.module.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onOpenPreferences: () => void
}

function Sidebar({ isOpen, onClose, onOpenPreferences }: SidebarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const sidebarRef = useRef<HTMLElement>(null)

  const handleHomeClick = () => {
    navigate('/')
    onClose()
  }

  const handlePreferencesClick = () => {
    onOpenPreferences()
    onClose()
  }

  // Use focus trap hook
  useFocusTrap(sidebarRef, isOpen, onClose)

  // Focus first element when opened
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      focusFirstElement(sidebarRef.current)
    }
  }, [isOpen])

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
        role="presentation"
      ></div>
          <nav
            id="sidebar-nav"
            ref={sidebarRef}
            className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
            aria-label="Main navigation"
            aria-hidden={!isOpen}
          >
            <div className={styles.nav}>
              <button
                className={styles.navItem}
                onClick={handleHomeClick}
              >
                {t('nav.home')}
              </button>
              <button
                className={styles.navItem}
                onClick={handlePreferencesClick}
              >
                {t('nav.preferences')}
              </button>
            </div>
          </nav>
    </>
  )
}

export default Sidebar

