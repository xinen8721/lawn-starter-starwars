import { KeyboardEvent } from 'react'
import { KEYBOARD_KEYS } from '../constants'

export function useKeyboardNav() {
  const handleEnterOrSpace = (callback: () => void) => (e: KeyboardEvent) => {
    if (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.SPACE) {
      e.preventDefault()
      callback()
    }
  }

  const handleArrowKeys = (
    onUp?: () => void,
    onDown?: () => void,
    onLeft?: () => void,
    onRight?: () => void
  ) => (e: KeyboardEvent) => {
    switch (e.key) {
      case KEYBOARD_KEYS.ARROW_UP:
        if (onUp) {
          e.preventDefault()
          onUp()
        }
        break
      case KEYBOARD_KEYS.ARROW_DOWN:
        if (onDown) {
          e.preventDefault()
          onDown()
        }
        break
      case KEYBOARD_KEYS.ARROW_LEFT:
        if (onLeft) {
          e.preventDefault()
          onLeft()
        }
        break
      case KEYBOARD_KEYS.ARROW_RIGHT:
        if (onRight) {
          e.preventDefault()
          onRight()
        }
        break
    }
  }

  return {
    handleEnterOrSpace,
    handleArrowKeys,
  }
}

