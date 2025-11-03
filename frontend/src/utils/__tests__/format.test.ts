import { formatNumber, truncate, capitalize } from '../format'

describe('format utilities', () => {
  describe('formatNumber', () => {
    test('adds commas to thousands', () => {
      expect(formatNumber(1000)).toBe('1,000')
    })

    test('adds commas to millions', () => {
      expect(formatNumber(1000000)).toBe('1,000,000')
    })

    test('handles small numbers without commas', () => {
      expect(formatNumber(100)).toBe('100')
    })

    test('handles zero', () => {
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('truncate', () => {
    test('shortens long text with ellipsis', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...')
    })

    test('does not truncate text shorter than max length', () => {
      expect(truncate('Hello', 10)).toBe('Hello')
    })

    test('handles exact length match', () => {
      expect(truncate('Hello', 5)).toBe('Hello')
    })
  })

  describe('capitalize', () => {
    test('capitalizes first letter of lowercase word', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    test('maintains already capitalized word', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })

    test('handles empty string', () => {
      expect(capitalize('')).toBe('')
    })

    test('handles single character', () => {
      expect(capitalize('a')).toBe('A')
    })
  })
})

