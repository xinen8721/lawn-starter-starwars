import { ReactNode } from 'react'
import Header from '../../Header'
import styles from './PageLayout.module.css'

interface PageLayoutProps {
  children: ReactNode
}

function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className={styles.page}>
      <Header />
      <main id="main-content" className={styles.main}>
        {children}
      </main>
    </div>
  )
}

export default PageLayout

