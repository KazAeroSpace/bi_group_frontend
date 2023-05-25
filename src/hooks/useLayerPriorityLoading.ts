import { useContext } from 'react'
import { LayerPriorityLoadingContext, type State } from '../contexts/LayerPriorityLoading'

export const useLayerPriorityLoading = (): State => useContext(LayerPriorityLoadingContext)
