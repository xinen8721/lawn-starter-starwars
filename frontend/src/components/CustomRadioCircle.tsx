import styles from './CustomRadioCircle.module.css'

interface CustomRadioCircleProps {
  checked: boolean
  size?: number
  dotSize?: number
}

/**
 * CustomRadioCircle - Generated from Zeplin design
 * Layers: "Ellipse" (unselected) and "Ellipse" + "Ellipse 2" (selected)
 * from screen "1 - Option Selected - Empty Input"
 * URL: https://zpl.io/aREGZ7g
 *
 * A pure visual component representing the custom radio button circle.
 *
 * Design specs:
 * - Circle size: 16px × 16px
 * - Unselected: White background (#ffffff), grey border (#c4c4c4), 1px
 * - Selected: Blue background (#0094ff), blue border (#0094ff)
 * - Center dot (when selected): 4px × 4px, white (#ffffff)
 * - Border radius: 50% (perfect circle)
 */
function CustomRadioCircle({
  checked,
  size = 16,
  dotSize = 4
}: CustomRadioCircleProps) {
  return (
    <span
      className={`${styles.radioCircle} ${checked ? styles.radioCircleSelected : ''}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {checked && (
        <span
          className={styles.radioCircleDot}
          style={{ width: dotSize, height: dotSize }}
        />
      )}
    </span>
  )
}

export default CustomRadioCircle

