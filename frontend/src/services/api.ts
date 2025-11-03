import axios from 'axios'
import type { SearchResponse, Person, Movie, StatisticsResponse } from '../types'
import { API_BASE_URL } from '../constants'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const searchApi = {
  search: async (type: 'people' | 'movies', term: string): Promise<SearchResponse> => {
    const response = await api.post('/search', { type, term })
    return response.data
  },

  getPerson: async (id: number): Promise<Person> => {
    const response = await api.get(`/people/${id}`)
    return response.data
  },

  getMovie: async (id: number): Promise<Movie> => {
    const response = await api.get(`/movies/${id}`)
    return response.data
  },

  getStatistics: async (): Promise<StatisticsResponse> => {
    const response = await api.get('/statistics')
    return response.data
  },
}

export default api

