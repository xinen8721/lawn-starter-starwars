import { useTranslation } from 'react-i18next'
import Spinner from './common/Spinner'
import styles from './LoadingState.module.css'

function LoadingState() {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <Spinner size="medium" />
      <p className={styles.text}>{t('loading.searching')}</p>
    </div>
  )
}

export default LoadingState

