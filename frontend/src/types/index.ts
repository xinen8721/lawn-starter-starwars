export interface SearchResult {
  id: number
  name: string
  url: string
}

export interface SearchResponse {
  type: 'people' | 'movies'
  term: string
  count: number
  results: SearchResult[]
}

export interface Person {
  id: number
  name: string
  birth_year: string
  gender: string
  eye_color: string
  hair_color: string
  height: string
  mass: string
  skin_color: string
  films: FilmReference[]
}

export interface Movie {
  id: number
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: string
  characters: PersonReference[]
}

export interface FilmReference {
  id: number
  url: string
}

export interface PersonReference {
  id: number
  url: string
}

export interface Statistics {
  top_queries: TopQuery[]
  average_response_time: number
  popular_hours: PopularHour[]
  total_searches: number
  searches_by_type: {
    people?: number
    movies?: number
  }
}

export interface StatisticsResponse {
  data: Statistics
  calculated_at: string
  calculation_time_ms: number
  cached_at: string
  cache_miss?: boolean
}

export interface TopQuery {
  term: string
  count: number
  percentage: number
}

export interface PopularHour {
  hour: number
  count: number
}

