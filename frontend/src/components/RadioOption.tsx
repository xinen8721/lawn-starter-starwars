import { KeyboardEvent } from 'react'
import CustomRadioCircle from './CustomRadioCircle'
import styles from './RadioOption.module.css'

interface RadioOptionProps {
  value: string
  label: string
  checked: boolean
  onChange: (value: string) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>, value: string) => void
  name?: string
  ariaLabel?: string
}

/**
 * RadioOption - Generated from Zeplin design
 * Layer: "People" (and "Movies") from screen "1 - Option Selected - Empty Input"
 * URL: https://zpl.io/aREGZ7g
 *
 * A custom-styled radio button with exact Zeplin specifications:
 * - Custom circular radio button (16px)
 * - Selected state: Blue (#0094ff) with white center dot (4px)
 * - Unselected state: White with grey border (#c4c4c4)
 * - Label: Montserrat, 14px, Bold (700)
 * - Spacing: 60px gap between options
 */
function RadioOption({
  value,
  label,
  checked,
  onChange,
  onKeyDown,
  name = 'radio-group',
  ariaLabel
}: RadioOptionProps) {
  const handleChange = () => {
    onChange(value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e, value)
    }
  }

  return (
    <label className={styles.radioOption}>
      <div className={styles.radioButtonWrapper}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={styles.radioInput}
          aria-label={ariaLabel || label}
        />
        <CustomRadioCircle checked={checked} />
      </div>
      <span className={styles.radioLabelText}>{label}</span>
    </label>
  )
}

export default RadioOption

