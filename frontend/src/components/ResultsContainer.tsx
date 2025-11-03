import { ReactNode } from 'react'
import styles from './ResultsContainer.module.css'

interface ResultsContainerProps {
  children: ReactNode
}

/**
 * ResultsContainer - Generated from Zeplin design
 * Layer: "MatchesBG" from screen "1 - Option Selected - Empty Input"
 * URL: https://zpl.io/aREGZ7g
 *
 * A styled container for search results with exact Zeplin specifications:
 * - Width: 582px (from design)
 * - Height: 582px (min-height in implementation)
 * - Background: White (#ffffff)
 * - Border: 1px solid #dadada
 * - Border radius: 4px
 * - Box shadow: 0 1px 2px 0 rgba(132, 132, 132, 0.75)
 * - Padding: 30px
 */
function ResultsContainer({ children }: ResultsContainerProps) {
  return (
    <div className={styles.resultsContainer}>
      {children}
    </div>
  )
}

export default ResultsContainer

