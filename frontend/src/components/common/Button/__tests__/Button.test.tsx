import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button', () => {
  test('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    let button = screen.getByText('Primary')
    expect(button.className).toContain('primary')

    rerender(<Button variant="secondary">Secondary</Button>)
    button = screen.getByText('Secondary')
    expect(button.className).toContain('secondary')
  })

  test('disabled button does not call onClick', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} disabled>Click</Button>)

    const button = screen.getByText('Click')
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByText('Custom')
    expect(button.className).toContain('custom-class')
  })

  test('forwards additional props to button element', () => {
    render(<Button data-testid="test-button" aria-label="Test">Button</Button>)
    const button = screen.getByTestId('test-button')
    expect(button).toHaveAttribute('aria-label', 'Test')
  })
})

