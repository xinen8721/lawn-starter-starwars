import { ReactNode, HTMLAttributes } from 'react'
import styles from './ContentContainer.module.css'

interface ContentContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  size?: 'small' | 'medium' | 'large' | 'full'
}

function ContentContainer({
  children,
  size = 'medium',
  className = '',
  ...props
}: ContentContainerProps) {
  return (
    <div className={`${styles.container} ${styles[size]} ${className}`} {...props}>
      {children}
    </div>
  )
}

export default ContentContainer

