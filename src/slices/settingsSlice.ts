import {
  type CaseReducer,
  createAction,
  createSlice,
  type PayloadAction,
  type SliceCaseReducers
} from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { startAppListening } from '../store/listenerMiddleware'
import { DateTime } from 'luxon'
import toast from 'react-hot-toast'
import { getToken } from '../api/arcgis'
import { type ArcGisToken } from '../types'

interface State {
  initialized: boolean
  arcgisApiKey: string
  arcgisToken: ArcGisToken | null
}
interface Reducers<State> extends SliceCaseReducers<State> {
  setInitialized: CaseReducer<State, PayloadAction<boolean>>
  setArcgisToken: CaseReducer<State, PayloadAction<ArcGisToken | null>>
}

export const settingsSlice = createSlice<State, Reducers<State>, 'settings'>({
  name: 'settings',
  initialState: {
    initialized: false,
    arcgisApiKey: process.env.REACT_APP_ARCGIS_API_KEY ?? '',
    arcgisToken: null
  },
  reducers: {
    setInitialized: (state, action) => {
      state.initialized = action.payload
    },
    setArcgisToken: (state, action) => {
      state.arcgisToken = action.payload
    }
  }
})

export const initialize = createAction('settings/initialize')

const { setArcgisToken, setInitialized } = settingsSlice.actions
export const arcgisApiKeySelector = (state: RootState): string => state.settings.arcgisApiKey
export const arcgisTokenSelector = (state: RootState): ArcGisToken | null => state.settings.arcgisToken
export const initializedSelector = (state: RootState): boolean => state.settings.initialized

startAppListening({
  actionCreator: initialize,
  effect: async (_, listenerApi) => {
    try {
      const arcgisToken = arcgisTokenSelector(listenerApi.getState())
      if (arcgisToken == null || arcgisToken.expires < DateTime.now().toMillis()) {
        listenerApi.dispatch(setArcgisToken(null))
        const response = await getToken()
        listenerApi.dispatch(setArcgisToken(response.data))
      }
      listenerApi.dispatch(setInitialized(true))
    } catch {
      toast.error('Не удалось запросить токен')
      listenerApi.dispatch(setInitialized(false))
    }
  }
})

export default settingsSlice.reducer
