import styles from './ErrorMessage.module.css'

interface ErrorMessageProps {
  message: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () => void
  details?: string
}

function ErrorMessage({
  message,
  type = 'error',
  onRetry,
  details,
}: ErrorMessageProps) {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '❌'
    }
  }

  return (
    <div className={`${styles.errorMessage} ${styles[type]}`} role="alert">
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <div className={styles.text}>
          <p className={styles.message}>{message}</p>
          {details && <p className={styles.details}>{details}</p>}
        </div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryButton}>
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage

