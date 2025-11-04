import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  test('returns stored value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('stored')
  })

  test('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      result.current[1]('updated')
    })

    expect(result.current[0]).toBe('updated')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'))
  })

  test('handles complex objects', () => {
    const initialObj = { name: 'test', value: 123 }
    const { result } = renderHook(() => useLocalStorage('test-key', initialObj))

    expect(result.current[0]).toEqual(initialObj)

    const updatedObj = { name: 'updated', value: 456 }
    act(() => {
      result.current[1](updatedObj)
    })

    expect(result.current[0]).toEqual(updatedObj)
    expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual(updatedObj)
  })

  test('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json{')
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })

  test('allows function updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))

    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })

    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[1]((prev: number) => prev + 1)
    })

    expect(result.current[0]).toBe(2)
  })
})

