import { KEYBOARD_KEYS } from '../constants'

/**
 * Check if the event is an Enter or Space key press
 */
export function isActivationKey(key: string): boolean {
  return key === KEYBOARD_KEYS.ENTER || key === KEYBOARD_KEYS.SPACE
}

/**
 * Check if the event is an Escape key press
 */
export function isEscapeKey(key: string): boolean {
  return key === KEYBOARD_KEYS.ESCAPE
}

/**
 * Check if the event is an Arrow key press
 */
export function isArrowKey(key: string): boolean {
  const arrowKeys = [
    KEYBOARD_KEYS.ARROW_UP,
    KEYBOARD_KEYS.ARROW_DOWN,
    KEYBOARD_KEYS.ARROW_LEFT,
    KEYBOARD_KEYS.ARROW_RIGHT,
  ]
  return arrowKeys.includes(key as typeof arrowKeys[number])
}

/**
 * Handle click or keyboard activation (Enter/Space)
 */
export function handleActivation(callback: () => void) {
  return (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e) {
      // Keyboard event
      if (isActivationKey(e.key)) {
        e.preventDefault()
        callback()
      }
    } else {
      // Mouse event
      callback()
    }
  }
}

