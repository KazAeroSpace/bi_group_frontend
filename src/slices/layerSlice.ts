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
  type Group,
  type GroupLayerAttribute,
  type Layer
} from '../types'
import {
  findLayer,
  findLayers
} from '../api/layer'
import { groupBy } from '../utils'

interface State {
  visibleLayersIds: number[]
  layerGroups: Array<AttributedData<Group>>
  layers: Array<AttributedData<Layer>>
  clickedLayer: AttributedData<Layer> | null
  clickedLayerItemId: number | null
}

interface Reducers<State> extends SliceCaseReducers<State> {
  setLayersData: CaseReducer<State, PayloadAction<Array<AttributedData<Layer>>>>
  setClickedLayer: CaseReducer<State, PayloadAction<AttributedData<Layer> | null>>
  setClickedLayerItemId: CaseReducer<State, PayloadAction<number | null>>
  setVisibleLayersIds: CaseReducer<State, PayloadAction<number[]>>
  setLayerGroups: CaseReducer<State, PayloadAction<Array<AttributedData<Group>>>>
  addVisibleLayer: CaseReducer<State, PayloadAction<number>>
  removeVisibleLayer: CaseReducer<State, PayloadAction<number>>
}

const layerSlice = createSlice<State, Reducers<State>, 'layer'>({
  name: 'layer',
  initialState: {
    layerGroups: [],
    visibleLayersIds: [],
    layers: [],
    clickedLayer: null,
    clickedLayerItemId: null
  },
  reducers: {
    setLayersData: (state, action) => {
      state.layers = action.payload
    },
    setClickedLayer: (state, action) => {
      state.clickedLayer = action.payload
    },
    setClickedLayerItemId: (state, action) => {
      state.clickedLayerItemId = action.payload
    },
    setVisibleLayersIds: (state, action) => {
      state.visibleLayersIds = action.payload
    },
    addVisibleLayer: (state, action) => {
      state.visibleLayersIds.push(action.payload)
    },
    removeVisibleLayer: (state, action) => {
      state.visibleLayersIds.splice(
        state.visibleLayersIds.findIndex(item => item === action.payload),
        1
      )
    },
    setLayerGroups: (state, action) => {
      state.layerGroups = action.payload
    }
  }
})

export const {
  setLayersData,
  setClickedLayer,
  setClickedLayerItemId,
  setVisibleLayersIds,
  setLayerGroups,
  addVisibleLayer,
  removeVisibleLayer
} = layerSlice.actions

export const fetchLayersData = createAction('layer/fetchLayersData')
export const fetchClickedLayer = createAction<{ layerId: number, groupLayerAttributeId: number }>('layer/fetchClickedLayer')
export const layersDataSelector = (state: RootState): Array<AttributedData<Layer>> => state.layer.layers
export const groupLayersDataSelector = (state: RootState): Array<[number, Array<AttributedData<Layer>>]> => {
  return Array.from(
    groupBy<number, AttributedData<Layer>>(
      state.layer.layers,
      (item) => item.attributes.group?.data?.id ?? 0
    )
  )
}
export const groupsDataSelector = (state: RootState): Array<AttributedData<Group>> => state.layer.layerGroups
export const layerDataSelector = (id: number) => (state: RootState): AttributedData<Layer> | undefined => state.layer.layers.find(item => item.id === id)
export const clickedLayerSelector = (state: RootState): AttributedData<Layer> | null => state.layer.clickedLayer
export const clickedLayerItemIdSelector = (state: RootState): number | null => state.layer.clickedLayerItemId
export const clickedLayerItemSelector = (state: RootState): GroupLayerAttribute | null => {
  const id = clickedLayerItemIdSelector(state)
  const result = state.layer.clickedLayer?.attributes.groupLayerAttributes?.find(
    (item) => item.id === id
  )
  return result ?? null
}
export const visibleLayersIdsSelector = (state: RootState): number[] => state.layer.visibleLayersIds
export const layerIsVisibleSelector = (id: number) => (state: RootState): boolean => {
  return state.layer.visibleLayersIds.findIndex(item => item === id) !== -1
}
export default layerSlice.reducer

startAppListening({
  actionCreator: fetchLayersData,
  effect: async (_, listenerApi) => {
    let toastLoadingID
    try {
      toastLoadingID = toast.loading('Loading data')
      const response = await findLayers({
        populate: ['groupLayerAttributes', 'icon', 'group'],
        pagination: { pageSize: 100 }
      })
      listenerApi.dispatch(setLayersData(response.data.data))
    } catch {
      toast.error('Request error of loading data')
    } finally {
      toast.dismiss(toastLoadingID)
    }
  }
})

startAppListening({
  actionCreator: setLayersData,
  effect: (action, listenerApi) => {
    const data = action.payload
    if (!data.length) {
      return
    }
    const ids = data
      .filter(item => {
        if (!item.attributes.visible) {
          return false
        }
        if (item.attributes.group?.data) {
          return item.attributes.group.data.attributes.visible
        }
        return true
      })
      .map(item => item.id)
    listenerApi.dispatch(setVisibleLayersIds(ids))
  }
})

startAppListening({
  actionCreator: setLayersData,
  effect: (action, listenerApi) => {
    const data = action.payload
    if (!data.length) {
      return
    }
    const groups = data
      .filter(item => item.attributes.group?.data)
      .map(item => item.attributes.group!.data)
    const uniqGroups = [...new Map(groups.map(item => [item!.id, item!])).values()]
    listenerApi.dispatch(setLayerGroups(uniqGroups))
  }
})

startAppListening({
  actionCreator: fetchClickedLayer,
  effect: async (action, listenerApi) => {
    let toastLoadingID
    try {
      toastLoadingID = toast.loading('Loading data')
      const { layerId, groupLayerAttributeId } = action.payload
      const clickedLayer = clickedLayerSelector(listenerApi.getState())
      if (!clickedLayer || clickedLayer.id !== layerId) {
        const response = await findLayer(layerId, {
          populate: ['groupLayerAttributes.layerAttributes.file']
        })
        listenerApi.dispatch(setClickedLayer(response.data.data))
      }
      listenerApi.dispatch(setClickedLayerItemId(groupLayerAttributeId))
    } catch {
      toast.error('Request error of loading data')
    } finally {
      toast.dismiss(toastLoadingID)
    }
  }
})
