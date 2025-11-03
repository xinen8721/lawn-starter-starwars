import { getFocusableElements, focusFirstElement, prefersReducedMotion } from '../a11y'

describe('a11y utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('getFocusableElements', () => {
    test('returns focusable elements from container', () => {
      document.body.innerHTML = `
        <div id="container">
          <button>Button 1</button>
          <a href="#">Link</a>
          <input type="text" />
          <button>Button 2</button>
        </div>
      `

      const container = document.getElementById('container')!
      const elements = getFocusableElements(container)

      expect(elements).toHaveLength(4)
    })

    test('includes disabled elements in query', () => {
      document.body.innerHTML = `
        <div id="container">
          <button>Enabled</button>
          <button disabled>Disabled</button>
          <input type="text" />
          <input type="text" disabled />
        </div>
      `

      const container = document.getElementById('container')!
      const elements = getFocusableElements(container)

      // getFocusableElements returns all matching elements including disabled
      expect(elements).toHaveLength(4)
    })

    test('returns empty array for container with no focusable elements', () => {
      document.body.innerHTML = `
        <div id="container">
          <div>Not focusable</div>
          <span>Also not focusable</span>
        </div>
      `

      const container = document.getElementById('container')!
      const elements = getFocusableElements(container)

      expect(elements).toHaveLength(0)
    })
  })

  describe('focusFirstElement', () => {
    test('focuses the first focusable element', () => {
      document.body.innerHTML = `
        <div id="container">
          <button id="first">First</button>
          <button id="second">Second</button>
        </div>
      `

      const container = document.getElementById('container')!
      focusFirstElement(container)

      expect(document.activeElement?.id).toBe('first')
    })
  })

  describe('prefersReducedMotion', () => {
    test('returns boolean value', () => {
      const result = prefersReducedMotion()
      expect(typeof result).toBe('boolean')
    })

    test('returns false by default', () => {
      const result = prefersReducedMotion()
      expect(result).toBe(false)
    })
  })
})

