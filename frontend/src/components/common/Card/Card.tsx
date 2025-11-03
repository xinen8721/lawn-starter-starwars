import { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  isClickable?: boolean
}

function Card({ children, isClickable = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`${styles.card} ${isClickable ? styles.clickable : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

