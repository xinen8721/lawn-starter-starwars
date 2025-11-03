import axios from 'axios'
import { searchApi } from '../api'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('searchApi', () => {
  const mockAxiosInstance = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedAxios.create = jest.fn(() => mockAxiosInstance as any)
  })

  describe('search', () => {
    test('calls correct endpoint with correct parameters', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: { results: [{ id: 1, name: 'Luke Skywalker' }] }
      })

      // Re-import to get fresh instance with mock
      jest.isolateModules(() => {
        const { searchApi: freshApi } = require('../api')
        return freshApi.search('people', 'Luke').then((result: any) => {
          expect(mockAxiosInstance.post).toHaveBeenCalledWith(
            '/search',
            { type: 'people', term: 'Luke' }
          )
          expect(result.results).toHaveLength(1)
          expect(result.results[0].name).toBe('Luke Skywalker')
        })
      })
    })

    test('handles movies search', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: { results: [{ id: 1, title: 'A New Hope' }] }
      })

      jest.isolateModules(() => {
        const { searchApi: freshApi } = require('../api')
        return freshApi.search('movies', 'Hope').then(() => {
          expect(mockAxiosInstance.post).toHaveBeenCalledWith(
            '/search',
            { type: 'movies', term: 'Hope' }
          )
        })
      })
    })
  })

  describe('getPerson', () => {
    test('calls correct endpoint with person id', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { id: 1, name: 'Luke Skywalker' }
      })

      jest.isolateModules(() => {
        const { searchApi: freshApi } = require('../api')
        return freshApi.getPerson(1).then((result: any) => {
          expect(mockAxiosInstance.get).toHaveBeenCalledWith('/people/1')
          expect(result.name).toBe('Luke Skywalker')
        })
      })
    })
  })

  describe('getMovie', () => {
    test('calls correct endpoint with movie id', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { id: 1, title: 'A New Hope' }
      })

      jest.isolateModules(() => {
        const { searchApi: freshApi } = require('../api')
        return freshApi.getMovie(1).then((result: any) => {
          expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movies/1')
          expect(result.title).toBe('A New Hope')
        })
      })
    })
  })

  describe('getStatistics', () => {
    test('calls correct endpoint', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { total_searches: 100 }
      })

      jest.isolateModules(() => {
        const { searchApi: freshApi } = require('../api')
        return freshApi.getStatistics().then((result: any) => {
          expect(mockAxiosInstance.get).toHaveBeenCalledWith('/statistics')
          expect(result.total_searches).toBe(100)
        })
      })
    })
  })
})

