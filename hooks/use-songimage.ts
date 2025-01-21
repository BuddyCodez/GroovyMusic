import * as React from 'react'
import type { SongImageState, SongImageAction } from '../types/song-image'

function imageReducer(state: SongImageState, action: SongImageAction): SongImageState {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, status: 'loading' }
    case 'LOAD_SUCCESS':
      return { ...state, status: 'success' }
    case 'LOAD_ERROR':
      return state.currentIndex > 0
        ? { ...state, currentIndex: state.currentIndex - 1, status: 'loading' }
        : { ...state, status: 'error', error: new Error('All image sources failed to load') }
    case 'TRY_NEXT_SOURCE':
      return { ...state, currentIndex: state.currentIndex - 1, status: 'loading' }
    case 'RESET':
      return { status: 'idle', currentIndex: state.currentIndex }
    default:
      return state
  }
}

export function useSongImage(sourcesLength: number) {
  const [state, dispatch] = React.useReducer(imageReducer, {
    status: 'idle',
    currentIndex: sourcesLength - 1
  })

  const reset = React.useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  React.useEffect(() => {
    reset()
  }, [sourcesLength, reset])

  return {
    state,
    dispatch,
    reset
  }
}

