import { render, screen } from '@testing-library/react'
import Card from '../Card'

describe('Card', () => {
  test('renders children correctly', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('custom-card')
  })

  test('renders complex children', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
        <button>Action</button>
      </Card>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })
})

