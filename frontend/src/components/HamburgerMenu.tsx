import styles from './HamburgerMenu.module.css'

interface HamburgerMenuProps {
  isOpen: boolean
  onClick: () => void
}

function HamburgerMenu({ isOpen, onClick }: HamburgerMenuProps) {
  return (
    <button
      className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="sidebar-nav"
    >
      <span className={styles.line} aria-hidden="true"></span>
      <span className={styles.line} aria-hidden="true"></span>
      <span className={styles.line} aria-hidden="true"></span>
    </button>
  )
}

export default HamburgerMenu

