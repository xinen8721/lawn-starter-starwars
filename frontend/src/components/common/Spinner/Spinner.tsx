import styles from './Spinner.module.css'

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

function Spinner({ size = 'medium', className = '' }: SpinnerProps) {
  return (
    <div className={`${styles.spinner} ${styles[size]} ${className}`} role="status" aria-label="Loading">
      <span className="u-sr-only">Loading...</span>
    </div>
  )
}

export default Spinner

