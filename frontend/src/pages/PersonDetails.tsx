import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import Header from '../components/Header'
import ErrorMessage from '../components/ErrorMessage'
import { searchApi } from '../services/api'
import type { Person } from '../types'
import styles from './PersonDetails.module.css'

function PersonDetails() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [person, setPerson] = useState<Person | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [movieTitles, setMovieTitles] = useState<{ [key: number]: string }>({})
  const [error, setError] = useState<{ message: string; details?: string } | null>(null)

  const fetchPerson = async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await searchApi.getPerson(parseInt(id))
      setPerson(data)

      // Fetch movie titles
      const titles: { [key: number]: string } = {}
      for (const film of data.films) {
        try {
          const movieData = await searchApi.getMovie(film.id)
          titles[film.id] = movieData.title
        } catch (err) {
          // Silently fail for individual movie fetches
          console.warn(`Failed to fetch movie ${film.id}:`, err)
        }
      }
      setMovieTitles(titles)
    } catch (err) {
      // Provide specific error messages
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK' || !err.response) {
          setError({
            message: 'Unable to connect to the server',
            details: 'Please check your internet connection and try again.',
          })
        } else if (err.response?.status === 404) {
          setError({
            message: 'Character not found',
            details: 'This character does not exist or has been removed.',
          })
        } else if (err.response?.status >= 500) {
          setError({
            message: 'Server error',
            details: 'Our servers are experiencing issues. Please try again later.',
          })
        } else {
          setError({
            message: 'Failed to load character',
            details: err.response?.data?.message || 'An unexpected error occurred.',
          })
        }
      } else {
        setError({
          message: 'An unexpected error occurred',
          details: 'Please try again.',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPerson()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading... - SWStarter</title>
        </Helmet>
        <div className={styles.page}>
          <Header />
          <main id="main-content" className={styles.content} role="main">
            <div className={styles.loading} role="status" aria-live="polite">{t('person.loading')}</div>
          </main>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error - SWStarter</title>
        </Helmet>
        <div className={styles.page}>
          <Header />
          <main id="main-content" className={styles.content} role="main">
            <div className={styles.container}>
              <ErrorMessage
                message={error.message}
                details={error.details}
                onRetry={fetchPerson}
              />
              <button
                className={styles.backButton}
                onClick={() => navigate('/')}
                aria-label={t('results.backToSearch')}
              >
                ← {t('results.backToSearch')}
              </button>
            </div>
          </main>
        </div>
      </>
    )
  }

  if (!person) {
    return (
      <>
        <Helmet>
          <title>Character Not Found - SWStarter</title>
        </Helmet>
        <div className={styles.page}>
          <Header />
          <main id="main-content" className={styles.content} role="main">
            <div className={styles.error} role="alert">{t('person.notFound')}</div>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{person.name} - Star Wars Character | SWStarter</title>
        <meta name="description" content={`Learn about ${person.name}, a Star Wars character. Birth year: ${person.birth_year}, Gender: ${person.gender}`} />
        <meta property="og:title" content={`${person.name} - Star Wars Character`} />
        <meta property="og:description" content={`Details about ${person.name} from Star Wars`} />
      </Helmet>

      <div className={styles.page}>
        <Header />

        <main id="main-content" className={styles.content}>
          <article className={styles.container}>
            <h1 className={styles.name}>{person.name}</h1>

            <div className={styles.grid}>
              <section className={styles.column} aria-labelledby="details-heading">
                <h2 id="details-heading" className={styles.sectionTitle}>{t('person.details')}</h2>
                <dl className={styles.details}>
                  <div className={styles.detailText}>
                    <dt className="u-sr-only">{t('person.birthYear')}</dt>
                    <dd>{t('person.birthYear')}: {person.birth_year}</dd>
                  </div>
                  <div className={styles.detailText}>
                    <dt className="u-sr-only">{t('person.gender')}</dt>
                    <dd>{t('person.gender')}: {person.gender}</dd>
                  </div>
                  <div className={styles.detailText}>
                    <dt className="u-sr-only">{t('person.eyeColor')}</dt>
                    <dd>{t('person.eyeColor')}: {person.eye_color}</dd>
                  </div>
                  <div className={styles.detailText}>
                    <dt className="u-sr-only">{t('person.hairColor')}</dt>
                    <dd>{t('person.hairColor')}: {person.hair_color}</dd>
                  </div>
                  <div className={styles.detailText}>
                    <dt className="u-sr-only">{t('person.height')}</dt>
                    <dd>{t('person.height')}: {person.height}</dd>
                  </div>
                  <div className={styles.detailText}>
                    <dt className="u-sr-only">{t('person.mass')}</dt>
                    <dd>{t('person.mass')}: {person.mass}</dd>
                  </div>
                </dl>
              </section>

              {person.films.length > 0 && (
                <section className={styles.column} aria-labelledby="movies-heading">
                  <h2 id="movies-heading" className={styles.sectionTitle}>{t('person.movies')}</h2>
                  <nav className={styles.linkList} aria-label="Related movies">
                    {person.films.map((film) => (
                      <Link
                        key={film.id}
                        to={`/movie/${film.id}`}
                        className={styles.link}
                      >
                        {movieTitles[film.id] || `Film ${film.id}`}
                      </Link>
                    ))}
                  </nav>
                </section>
              )}
            </div>

            <button className={styles.backButton} onClick={() => navigate('/')}>
              {t('results.backToSearch')}
            </button>
          </article>
        </main>
      </div>
    </>
  )
}

export default PersonDetails

