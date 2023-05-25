import api from './index'
import {
  type AttributedData,
  type BackendFindOneResponse,
  type BackendFindResponse,
  type Layer,
  type QueryParams
} from '../types'
import { type AxiosResponse } from 'axios'

export const findLayers = async (params?: Partial<QueryParams>): Promise<AxiosResponse<BackendFindResponse<AttributedData<Layer>>>> => {
  return await api.get('/api/layers', { params })
}

export const findLayer = async (id: number, params?: Partial<QueryParams>): Promise<AxiosResponse<BackendFindOneResponse<AttributedData<Layer>>>> => {
  return await api.get(`/api/layers/${id}`, { params })
}
