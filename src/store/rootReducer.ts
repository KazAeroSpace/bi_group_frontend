import { combineReducers } from '@reduxjs/toolkit'
import { default as settingsReducer } from '../slices/settingsSlice'
import { default as layerReducer } from '../slices/layerSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistedSettingsReducer = persistReducer(
  { key: 'settings', storage, whitelist: ['arcgisToken'] },
  settingsReducer
)

export const rootReducer = combineReducers({
  settings: persistedSettingsReducer,
  layer: layerReducer
})
