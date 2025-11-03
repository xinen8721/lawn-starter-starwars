import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { searchApi } from '../services/api'
import type { StatisticsResponse } from '../types'
import styles from './Statistics.module.css'

function Statistics() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [statsResponse, setStatsResponse] = useState<StatisticsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await searchApi.getStatistics()
        setStatsResponse(data)
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>{t('statistics.loading')}</div>
      </div>
    )
  }

  if (!statsResponse) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.error}>{t('statistics.failed')}</div>
      </div>
    )
  }

  const stats = statsResponse.data

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>{t('statistics.title')}</h2>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('statistics.overview')}</h3>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{t('statistics.totalSearches')}</span>
                <span className={styles.statValue}>{stats.total_searches}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>{t('statistics.averageResponseTime')}</span>
                <span className={styles.statValue}>{stats.average_response_time}ms</span>
              </div>
              {stats.searches_by_type.people !== undefined && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>{t('statistics.peopleSearches')}</span>
                  <span className={styles.statValue}>{stats.searches_by_type.people}</span>
                </div>
              )}
              {stats.searches_by_type.movies !== undefined && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>{t('statistics.movieSearches')}</span>
                  <span className={styles.statValue}>{stats.searches_by_type.movies}</span>
                </div>
              )}
            </div>
          </div>

          {stats.top_queries.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('statistics.topQueries')}</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t('statistics.searchTerm')}</th>
                      <th>{t('statistics.count')}</th>
                      <th>{t('statistics.percentage')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.top_queries.map((query, index) => (
                      <tr key={index}>
                        <td>{query.term}</td>
                        <td>{query.count}</td>
                        <td>{query.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {stats.popular_hours.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('statistics.popularHours')}</h3>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t('statistics.hour')}</th>
                      <th>{t('statistics.searchCount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.popular_hours.slice(0, 10).map((hour, index) => (
                      <tr key={index}>
                        <td>{hour.hour}:00</td>
                        <td>{hour.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button className={styles.backButton} onClick={() => navigate('/')}>
            {t('results.backToSearch')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Statistics

