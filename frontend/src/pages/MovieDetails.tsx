import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { searchApi } from '../services/api'
import type { Movie } from '../types'
import styles from './MovieDetails.module.css'

function MovieDetails() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [characterNames, setCharacterNames] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return

      try {
        const data = await searchApi.getMovie(parseInt(id))
        setMovie(data)

        // Fetch character names (only first 10 to avoid too many requests)
        const names: { [key: number]: string } = {}
        const charactersToFetch = data.characters.slice(0, 10)

        for (const character of charactersToFetch) {
          try {
            const personData = await searchApi.getPerson(character.id)
            names[character.id] = personData.name
          } catch (error) {
            console.error(`Failed to fetch character ${character.id}:`, error)
          }
        }
        setCharacterNames(names)
      } catch (error) {
        console.error('Failed to fetch movie:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovie()
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
            <div className={styles.loading} role="status" aria-live="polite">{t('movie.loading')}</div>
          </main>
        </div>
      </>
    )
  }

  if (!movie) {
    return (
      <>
        <Helmet>
          <title>Movie Not Found - SWStarter</title>
        </Helmet>
        <div className={styles.page}>
          <Header />
          <main id="main-content" className={styles.content} role="main">
            <div className={styles.error} role="alert">{t('movie.notFound')}</div>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{movie.title} - Star Wars Film | SWStarter</title>
        <meta name="description" content={`${movie.title} - ${movie.opening_crawl.substring(0, 150)}...`} />
        <meta property="og:title" content={`${movie.title} - Star Wars Film`} />
        <meta property="og:description" content={movie.opening_crawl.substring(0, 200)} />
      </Helmet>

      <div className={styles.page}>
        <Header />

        <main id="main-content" className={styles.content}>
          <article className={styles.container}>
            <h1 className={styles.title}>{movie.title}</h1>

            <div className={styles.grid}>
              <section className={styles.column} aria-labelledby="crawl-heading">
                <h2 id="crawl-heading" className={styles.sectionTitle}>{t('movie.openingCrawl')}</h2>
                <p className={styles.crawl}>{movie.opening_crawl}</p>
              </section>

              {movie.characters.length > 0 && (
                <section className={styles.column} aria-labelledby="characters-heading">
                  <h2 id="characters-heading" className={styles.sectionTitle}>{t('movie.characters')}</h2>
                  <nav className={styles.linkList} aria-label="Movie characters">
                    {movie.characters.slice(0, 10).map((character) => (
                      <Link
                        key={character.id}
                        to={`/person/${character.id}`}
                        className={styles.link}
                      >
                        {characterNames[character.id] || `Character ${character.id}`}
                      </Link>
                    ))}
                    {movie.characters.length > 10 && (
                      <span className={styles.moreText} aria-label={`${movie.characters.length - 10} more characters`}>
                        {t('movie.andMore', { count: movie.characters.length - 10 })}
                      </span>
                    )}
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

export default MovieDetails

