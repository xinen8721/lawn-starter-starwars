import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'

// Mock all hooks at module level
jest.mock('../../hooks', () => ({
  usePreferences: () => ({
    theme: 'light',
    language: 'en',
    setTheme: jest.fn(),
    setLanguage: jest.fn(),
  }),
  useFocusTrap: () => jest.fn(),
  useKeyboardNav: jest.fn(),
  useLocalStorage: () => ['', jest.fn()],
}))

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Header', () => {
  it('renders the brand title', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('header.title')).toBeInTheDocument()
  })

  it('renders the hamburger menu button', () => {
    renderWithProviders(<Header />)
    const button = screen.getByRole('button', { name: /open menu/i })
    expect(button).toBeInTheDocument()
  })
})

