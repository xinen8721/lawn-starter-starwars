import { render } from '@testing-library/react'
import Spinner from '../Spinner'

describe('Spinner', () => {
  test('renders without crashing', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeInTheDocument()
  })

  test('applies small size class', () => {
    const { container } = render(<Spinner size="small" />)
    const spinner = container.firstChild as HTMLElement
    expect(spinner.className).toContain('small')
  })

  test('applies medium size class (default)', () => {
    const { container } = render(<Spinner />)
    const spinner = container.firstChild as HTMLElement
    expect(spinner.className).toContain('spinner')
  })

  test('applies large size class', () => {
    const { container } = render(<Spinner size="large" />)
    const spinner = container.firstChild as HTMLElement
    expect(spinner.className).toContain('large')
  })

  test('has proper ARIA attributes for accessibility', () => {
    const { container } = render(<Spinner />)
    const spinner = container.firstChild as HTMLElement
    expect(spinner).toHaveAttribute('role', 'status')
    expect(spinner).toHaveAttribute('aria-label')
  })
})

