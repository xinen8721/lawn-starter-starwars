import { ReactNode } from 'react'
import styles from './SearchPromptLabel.module.css'

interface SearchPromptLabelProps {
  children: ReactNode
  htmlFor?: string
  as?: 'label' | 'legend'
}

/**
 * SearchPromptLabel - Generated from Zeplin design
 * Layer: "What are you searching for?" from screen "1 - Option Selected - Empty Input"
 * URL: https://zpl.io/aREGZ7g
 *
 * A styled label/legend component for search prompts with the exact
 * typography and spacing from Zeplin specification.
 *
 * Design specs:
 * - Font: Montserrat, 14px, Semi-Bold (600)
 * - Color: #383838 (dark grey)
 * - Height: 18px
 * - Text transform: uppercase
 */
function SearchPromptLabel({
  children,
  htmlFor,
  as: Component = 'label'
}: SearchPromptLabelProps) {
  return (
    <Component
      className={styles.searchPromptLabel}
      {...(Component === 'label' && htmlFor ? { htmlFor } : {})}
    >
      {children}
    </Component>
  )
}

export default SearchPromptLabel

