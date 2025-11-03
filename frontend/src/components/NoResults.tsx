import { useTranslation } from 'react-i18next'
import styles from './NoResults.module.css'

function NoResults() {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <p className={styles.message}>{t('empty.noMatches')}</p>
      <p className={styles.hint}>{t('empty.useForm')}</p>
    </div>
  )
}

export default NoResults

