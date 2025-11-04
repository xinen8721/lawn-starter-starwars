import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import Header from '../components/Header'
import SearchContainer from '../components/SearchContainer'
import ResultsContainer from '../components/ResultsContainer'
import SearchForm from '../components/SearchForm'
import ResultCard from '../components/ResultCard'
import LoadingState from '../components/LoadingState'
import NoResults from '../components/NoResults'
import ErrorMessage from '../components/ErrorMessage'
import { searchApi } from '../services/api'
import type { SearchResult } from '../types'
import styles from './SearchPage.module.css'

function SearchPage() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people')
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<{ message: string; details?: string } | null>(null)
  const [lastSearchTerm, setLastSearchTerm] = useState<string>('')

  const handleSearch = async (type: 'people' | 'movies', term: string) => {
    setIsLoading(true)
    setHasSearched(true)
    setSearchType(type)
    setLastSearchTerm(term)
    setError(null)

    try {
      const response = await searchApi.search(type, term)
      setResults(response.results)
    } catch (err) {
      // Provide specific error messages based on error type
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK' || !err.response) {
          setError({
            message: 'Unable to connect to the server',
            details: 'Please check your internet connection and try again.',
          })
        } else if (err.response?.status === 404) {
          setError({
            message: 'Resource not found',
            details: 'The requested resource could not be found.',
          })
        } else if (err.response?.status === 429) {
          setError({
            message: 'Too many requests',
            details: 'Please wait a moment before trying again.',
          })
        } else if (err.response?.status >= 500) {
          setError({
            message: 'Server error',
            details: 'Our servers are experiencing issues. Please try again later.',
          })
        } else {
          setError({
            message: 'Search failed',
            details: err.response?.data?.message || 'An unexpected error occurred.',
          })
        }
      } else {
        setError({
          message: 'An unexpected error occurred',
          details: 'Please try again.',
        })
      }
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (lastSearchTerm) {
      handleSearch(searchType, lastSearchTerm)
    }
  }

  const handleBackToSearch = () => {
    setHasSearched(false)
    setResults(null)
  }

  return (
    <>
      <Helmet>
        <title>SWStarter - Star Wars Character and Movie Search</title>
        <meta name="description" content="Search for Star Wars characters and movies. Explore detailed information about your favorite heroes, villains, and films from the Star Wars universe." />
        <meta property="og:title" content="SWStarter - Star Wars Search" />
        <meta property="og:description" content="Search for Star Wars characters and movies" />
      </Helmet>

      <div className={styles.page}>
        <Header />

        <main id="main-content" className={styles.content}>
          {/* Left Panel - Search Form (always visible on desktop) */}
          <section
            className={styles.searchPanel}
            data-mobile-hide={hasSearched ? "true" : "false"}
            aria-label="Search form"
          >
            <SearchContainer>
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </SearchContainer>
          </section>

          {/* Right Panel - Results (always visible, shows different states) */}
          <section
            className={styles.resultsPanel}
            data-mobile-hide={!hasSearched ? "true" : "false"}
            aria-label="Search results"
            role="region"
            aria-live="polite"
            aria-atomic="false"
          >
            <ResultsContainer>
              <div className={styles.resultsHeader}>
                <h2 className={styles.resultsTitle}>{t('search.resultsTitle')}</h2>
              </div>

              {!hasSearched ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyMessage}>{t('empty.noMatches')}</p>
                  <p className={styles.emptyHint}>{t('empty.useForm')}</p>
                </div>
              ) : isLoading ? (
                <LoadingState />
              ) : error ? (
                <ErrorMessage
                  message={error.message}
                  details={error.details}
                  onRetry={handleRetry}
                />
              ) : results && results.length === 0 ? (
                <NoResults />
              ) : results && results.length > 0 ? (
                <>
                  <div className={styles.resultsGrid} role="list">
                    {results.map((result) => (
                      <ResultCard
                        key={result.id}
                        id={result.id}
                        name={result.name}
                        type={searchType}
                      />
                    ))}
                  </div>
                  <div className={styles.mobileBackButton}>
                    <button
                      className={styles.backButton}
                      onClick={handleBackToSearch}
                    >
                      {t('results.backToSearch')}
                    </button>
                  </div>
                </>
              ) : null}
            </ResultsContainer>
          </section>
        </main>
      </div>
    </>
  )
}

export default SearchPage

