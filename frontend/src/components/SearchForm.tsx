import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchPromptLabel from './SearchPromptLabel'
import RadioOption from './RadioOption'
import SearchInput from './SearchInput'
import SearchButton from './SearchButton'
import styles from './SearchForm.module.css'

interface SearchFormProps {
  onSearch: (type: 'people' | 'movies', term: string) => void
  isLoading: boolean
}

function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const { t } = useTranslation()
  const [searchType, setSearchType] = useState<'people' | 'movies'>('people')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchType, searchTerm.trim())
    }
  }

  const handleRadioKeyDown = (e: React.KeyboardEvent, value: 'people' | 'movies') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSearchType(value)
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setSearchType(value === 'people' ? 'movies' : 'people')
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setSearchType(value === 'people' ? 'movies' : 'people')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search" aria-label="Star Wars search">
      <fieldset className={styles.fieldset}>
        <SearchPromptLabel as="legend">
          {t('search.label')}
        </SearchPromptLabel>

        <div className={styles.radioGroup} role="radiogroup">
          <RadioOption
            value="people"
            label={t('search.people')}
            checked={searchType === 'people'}
            onChange={(value) => setSearchType(value as 'people' | 'movies')}
            onKeyDown={handleRadioKeyDown}
            name="searchType"
            ariaLabel={t('search.people')}
          />

          <RadioOption
            value="movies"
            label={t('search.movies')}
            checked={searchType === 'movies'}
            onChange={(value) => setSearchType(value as 'people' | 'movies')}
            onKeyDown={handleRadioKeyDown}
            name="searchType"
            ariaLabel={t('search.movies')}
          />
        </div>
      </fieldset>

      <div className={styles.inputWrapper}>
        <label htmlFor="search-input" className="u-sr-only">
          Search term
        </label>
        <SearchInput
          id="search-input"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={
            searchType === 'people'
              ? t('search.placeholderPeople')
              : t('search.placeholderMovies')
          }
          ariaLabel={`Search for ${searchType}`}
        />
      </div>

      <SearchButton
        type="submit"
        disabled={!searchTerm.trim() || isLoading}
        aria-live="polite"
      >
        {isLoading ? t('search.buttonSearching') : t('search.buttonSearch')}
      </SearchButton>
    </form>
  )
}

export default SearchForm
