import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import SearchContainer from '../components/SearchContainer'
import ResultsContainer from '../components/ResultsContainer'
import SearchForm from '../components/SearchForm'
import ResultCard from '../components/ResultCard'
import LoadingState from '../components/LoadingState'
import NoResults from '../components/NoResults'
import { searchApi } from '../services/api'
import type { SearchResult } from '../types'
import styles from './SearchPage.module.css'

function SearchPage() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (type: 'people' | 'movies', term: string) => {
    setIsLoading(true)
    setHasSearched(true)
    setSearchType(type)

    try {
      const response = await searchApi.search(type, term)
      setResults(response.results)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsLoading(false)
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

