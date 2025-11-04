import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './SearchButton.module.css'

interface SearchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'default' | 'disabled'
  fullWidth?: boolean
}

/**
 * SearchButton - Generated from Zeplin design
 * Layers: "SearchButton-Disabled" (button background) and "SEARCH" (button text)
 * from screen "1 - Option Selected - Empty Input"
 * URL: https://zpl.io/aREGZ7g
 *
 * A styled search button with exact Zeplin specifications:
 * - Width: 350px (full width in implementation)
 * - Height: 34px
 * - Border radius: 20px (pill shape)
 * - Font: Montserrat, 14px, Bold (700)
 * - Text transform: uppercase
 * - Active state: Green (#0ab463 - green-teal from design tokens)
 * - Disabled state: Grey (#c4c4c4 - pinkish-grey from design tokens)
 * - Text color: White (#ffffff)
 */
function SearchButton({
  children,
  fullWidth = true,
  disabled,
  ...props
}: SearchButtonProps) {
  return (
    <button
      className={`${styles.searchButton} ${fullWidth ? styles.fullWidth : ''} ${disabled ? styles.disabled : ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default SearchButton

