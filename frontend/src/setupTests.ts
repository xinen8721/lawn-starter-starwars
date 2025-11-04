import '@testing-library/jest-dom'

// Mock constants/app to avoid import.meta issues
jest.mock('./constants/app')

// Mock import.meta for Vite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as any).importMeta = {
  env: {
    VITE_API_URL: 'http://localhost:8000',
  },
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

