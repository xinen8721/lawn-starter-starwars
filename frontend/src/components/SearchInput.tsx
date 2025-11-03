import { ChangeEvent, HTMLAttributes } from 'react'
import styles from './SearchInput.module.css'

interface SearchInputProps extends Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  ariaLabel?: string
}

/**
 * SearchInput - Generated from Zeplin design
 * Layer: "Rectangle" (input field) and "e.g. Chewbacca, Yoda, Boba Fett" (placeholder)
 * from screen "1 - Option Selected - Empty Input"
 * URL: https://zpl.io/aREGZ7g
 *
 * A styled search input field with exact Zeplin specifications:
 * - Width: 350px (from design, responsive in implementation)
 * - Height: 40px
 * - Border: 1px solid #c4c4c4
 * - Border radius: 4px
 * - Font: Montserrat, 14px, Bold (700)
 * - Inner shadow: inset 0 1px 3px 0 rgba(132, 132, 132, 0.75)
 * - Placeholder color: #c4c4c4 (pinkish-grey from design tokens)
 */
function SearchInput({
  value,
  onChange,
  placeholder,
  id,
  ariaLabel,
  ...props
}: SearchInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <input
      id={id}
      type="text"
      className={styles.searchInput}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      aria-label={ariaLabel}
      {...props}
    />
  )
}

export default SearchInput

