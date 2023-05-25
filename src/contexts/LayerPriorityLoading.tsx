import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback
} from 'react'
import { LayerPriorityLoading } from '../types'
import { useImmerReducer } from 'use-immer'

export type State = Record<LayerPriorityLoading, number[]>

const initialState = {
  [LayerPriorityLoading.HIGH]: [],
  [LayerPriorityLoading.MIDDLE]: [],
  [LayerPriorityLoading.LOW]: []
}

type ActionType =
    | 'ADD_TO_HIGH'
    | 'REMOVE_FROM_HIGH'
    | 'ADD_TO_MIDDLE'
    | 'REMOVE_FROM_MIDDLE'
    | 'ADD_TO_LOW'
    | 'REMOVE_FROM_LOW'

interface Action { type: ActionType, payload: number }

export const LayerPriorityLoadingContext = createContext<State & { queueHandler: (action: Action) => void }>({
  ...initialState,
  queueHandler: () => {}
})

const reducer = (state: State, action: Action): void => {
  switch (action.type) {
    case 'ADD_TO_HIGH':
      state.HIGH.push(action.payload)
      break
    case 'REMOVE_FROM_HIGH':
      state.HIGH.splice(
        state.HIGH.findIndex(item => item === action.payload),
        1
      )
      break
    case 'ADD_TO_MIDDLE':
      state.MIDDLE.push(action.payload)
      break
    case 'REMOVE_FROM_MIDDLE':
      state.MIDDLE.splice(
        state.MIDDLE.findIndex(item => item === action.payload),
        1
      )
      break
    case 'ADD_TO_LOW':
      state.LOW.push(action.payload)
      break
    case 'REMOVE_FROM_LOW':
      state.LOW.splice(
        state.LOW.findIndex(item => item === action.payload),
        1
      )
      break
  }
}
export const LayerPriorityLoadingProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useImmerReducer<State, Action>(reducer, initialState)
  const queueHandler = useCallback((action: Action) => {
    dispatch(action)
  }, [dispatch])
  return (
      <LayerPriorityLoadingContext.Provider value={{ ...state, queueHandler }}>
        {children}
      </LayerPriorityLoadingContext.Provider>
  )
}
