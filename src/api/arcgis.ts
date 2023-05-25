import api from './index'
import { type ArcGisToken } from '../types'
import { type AxiosResponse } from 'axios'

export const getToken = async (): Promise<AxiosResponse<ArcGisToken>> => {
  return await api.post(
    '/api/arcgis/auth',
    { referer: window.location.origin }
  )
}
