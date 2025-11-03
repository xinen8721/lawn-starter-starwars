import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from './ResultCard.module.css'

interface ResultCardProps {
  id: number
  name: string
  type: 'people' | 'movies'
}

function ResultCard({ id, name, type }: ResultCardProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleClick = () => {
    navigate(type === 'people' ? `/person/${id}` : `/movie/${id}`)
  }

  return (
    <article className={styles.card}>
      <h3 className={styles.resultName}>{name}</h3>
      <button
        className={styles.detailsButton}
        onClick={handleClick}
        aria-label={`View details for ${name}`}
      >
        {t('results.seeDetails')}
      </button>
    </article>
  )
}

export default ResultCard

