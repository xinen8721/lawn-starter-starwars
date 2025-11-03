import { ReactNode } from 'react'
import styles from './SearchContainer.module.css'

interface SearchContainerProps {
  children: ReactNode
}

/**
 * SearchContainer - Generated from Zeplin design
 * Layer: "SearchContainer" from screen "1 - Option Selected - Empty Input"
 * URL: https://zpl.io/aREGZ7g
 *
 * A styled container that wraps the search form with proper spacing,
 * borders, shadows, and background matching the Zeplin specification.
 */
function SearchContainer({ children }: SearchContainerProps) {
  return (
    <div className={styles.searchContainer}>
      {children}
    </div>
  )
}

export default SearchContainer

