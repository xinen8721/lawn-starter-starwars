import { isActivationKey, isEscapeKey, handleActivation } from '../keyboard'

describe('keyboard utilities', () => {
  describe('isActivationKey', () => {
    test('detects Enter key', () => {
      expect(isActivationKey('Enter')).toBe(true)
    })

    test('detects Space key', () => {
      expect(isActivationKey(' ')).toBe(true)
    })

    test('returns false for other keys', () => {
      expect(isActivationKey('a')).toBe(false)
      expect(isActivationKey('Tab')).toBe(false)
      expect(isActivationKey('Escape')).toBe(false)
    })
  })

  describe('isEscapeKey', () => {
    test('detects Escape key', () => {
      expect(isEscapeKey('Escape')).toBe(true)
    })

    test('returns false for other keys', () => {
      expect(isEscapeKey('Enter')).toBe(false)
      expect(isEscapeKey(' ')).toBe(false)
      expect(isEscapeKey('a')).toBe(false)
    })
  })

  describe('handleActivation', () => {
    test('calls callback on Enter key', () => {
      const callback = jest.fn()
      const handler = handleActivation(callback)
      const event = {
        key: 'Enter',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent

      handler(event)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    test('calls callback on Space key', () => {
      const callback = jest.fn()
      const handler = handleActivation(callback)
      const event = {
        key: ' ',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent

      handler(event)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(event.preventDefault).toHaveBeenCalled()
    })

    test('does not call callback on other keys', () => {
      const callback = jest.fn()
      const handler = handleActivation(callback)
      const event = {
        key: 'a',
        preventDefault: jest.fn()
      } as unknown as React.KeyboardEvent

      handler(event)

      expect(callback).not.toHaveBeenCalled()
    })

    test('calls callback on mouse click', () => {
      const callback = jest.fn()
      const handler = handleActivation(callback)
      const event = {} as React.MouseEvent

      handler(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})

