import {
  type CaseReducer,
  createAction,
  createSlice,
  type PayloadAction,
  type SliceCaseReducers
} from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { startAppListening } from '../store/listenerMiddleware'
import toast from 'react-hot-toast'
import {
  type AttributedData,
  type GroupLayerAttribute,
  type Layer
} from '../types'
import {
  findLayer,
  findLayers
} from '../api/layer'

interface State {
  data: Array<AttributedData<Layer>>
  clickedLayer: AttributedData<Layer> | null
  clickedLayerItemId: number | null
}

interface Reducers<State> extends SliceCaseReducers<State> {
  setLayersData: CaseReducer<State, PayloadAction<Array<AttributedData<Layer>>>>
  setClickedLayer: CaseReducer<State, PayloadAction<AttributedData<Layer> | null>>
  setClickedLayerItemId: CaseReducer<State, PayloadAction<number | null>>
}

const layerSlice = createSlice<State, Reducers<State>, 'layer'>({
  name: 'layer',
  initialState: {
    data: [],
    clickedLayer: null,
    clickedLayerItemId: null
  },
  reducers: {
    setLayersData: (state, action) => {
      state.data = action.payload
    },
    setClickedLayer: (state, action) => {
      state.clickedLayer = action.payload
    },
    setClickedLayerItemId: (state, action) => {
      state.clickedLayerItemId = action.payload
    }
  }
})

export const {
  setLayersData,
  setClickedLayer,
  setClickedLayerItemId
} = layerSlice.actions

export const fetchLayersData = createAction('layer/fetchLayersData')
export const fetchClickedLayer = createAction<{ layerId: number, groupLayerAttributeId: number }>('layer/fetchClickedLayer')
export const layersDataSelector = (state: RootState): Array<AttributedData<Layer>> => state.layer.data
export const layerDataSelector = (id: number) => (state: RootState): AttributedData<Layer> | undefined => state.layer.data.find(item => item.id === id)
export const clickedLayerSelector = (state: RootState): AttributedData<Layer> | null => state.layer.clickedLayer
export const clickedLayerItemIdSelector = (state: RootState): number | null => state.layer.clickedLayerItemId
export const clickedLayerItemSelector = (state: RootState): GroupLayerAttribute | null => {
  const id = clickedLayerItemIdSelector(state)
  const result = state.layer.clickedLayer?.attributes.groupLayerAttributes?.find(
    (item) => item.id === id
  )
  return result ?? null
}
export default layerSlice.reducer

startAppListening({
  actionCreator: fetchLayersData,
  effect: async (_, listenerApi) => {
    let toastLoadingID
    try {
      toastLoadingID = toast.loading('Загрузка слоёв')
      const response = await findLayers({ populate: ['groupLayerAttributes', 'icon'], pagination: { pageSize: 50 } })
      listenerApi.dispatch(setLayersData(response.data.data))
    } catch {
      toast.error('Ошибка при загрузки слоёв')
    } finally {
      toast.dismiss(toastLoadingID)
    }
  }
})

startAppListening({
  actionCreator: fetchClickedLayer,
  effect: async (action, listenerApi) => {
    let toastLoadingID
    try {
      toastLoadingID = toast.loading('Загрузка данных слоя')
      const { layerId, groupLayerAttributeId } = action.payload
      const clickedLayer = clickedLayerSelector(listenerApi.getState())
      if (!clickedLayer || clickedLayer.id !== layerId) {
        const response = await findLayer(layerId, { populate: ['groupLayerAttributes.layerAttributes.file'] })
        listenerApi.dispatch(setClickedLayer(response.data.data))
      }
      listenerApi.dispatch(setClickedLayerItemId(groupLayerAttributeId))
    } catch {
      toast.error('Ошибка при загрузки данных слоя')
    } finally {
      toast.dismiss(toastLoadingID)
    }
  }
})
