import axios from 'axios'

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedAxios.create = jest.fn(() => mockAxiosInstance as any)
  })

  describe('search', () => {
    test('calls correct endpoint with correct parameters', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: { results: [{ id: 1, name: 'Luke Skywalker' }] }
      })

      // Re-import to get fresh instance with mock
      await jest.isolateModulesAsync(async () => {
        const { searchApi: freshApi } = await import('../api')
        const result = await freshApi.search('people', 'Luke')
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          '/search',
          { type: 'people', term: 'Luke' }
        )
        expect(result.results).toHaveLength(1)
        expect(result.results[0].name).toBe('Luke Skywalker')
      })
    })

    test('handles movies search', async () => {
      mockAxiosInstance.post.mockResolvedValue({
        data: { results: [{ id: 1, title: 'A New Hope' }] }
      })

      await jest.isolateModulesAsync(async () => {
        const { searchApi: freshApi } = await import('../api')
        await freshApi.search('movies', 'Hope')
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          '/search',
          { type: 'movies', term: 'Hope' }
        )
      })
    })
  })

  describe('getPerson', () => {
    test('calls correct endpoint with person id', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { id: 1, name: 'Luke Skywalker' }
      })

      await jest.isolateModulesAsync(async () => {
        const { searchApi: freshApi } = await import('../api')
        const result = await freshApi.getPerson(1)
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/people/1')
        expect(result.name).toBe('Luke Skywalker')
      })
    })
  })

  describe('getMovie', () => {
    test('calls correct endpoint with movie id', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: { id: 1, title: 'A New Hope' }
      })

      await jest.isolateModulesAsync(async () => {
        const { searchApi: freshApi } = await import('../api')
        const result = await freshApi.getMovie(1)
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/movies/1')
        expect(result.title).toBe('A New Hope')
      })
    })
  })

  describe('getStatistics', () => {
    test('calls correct endpoint', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          data: {
            total_searches: 100,
            average_response_time: 150,
            top_queries: [],
            popular_hours: [],
            searches_by_type: {}
          },
          calculated_at: '2024-01-01T00:00:00Z',
          calculation_time_ms: 5,
          cached_at: '2024-01-01T00:00:00Z'
        }
      })

      await jest.isolateModulesAsync(async () => {
        const { searchApi: freshApi } = await import('../api')
        const result = await freshApi.getStatistics()
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/statistics')
        expect(result.data.total_searches).toBe(100)
      })
    })
  })
})

