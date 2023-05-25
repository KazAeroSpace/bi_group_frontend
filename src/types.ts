export interface Layer {
  objectid: string | null
  title: string | null
  type: LayerType
  url: string
  heading: number
  opacity: number
  loadPriority: LayerPriorityLoading
  groupLayerAttributes?: GroupLayerAttribute[]
  icon?: { data: AttributedData<Image> | null }
  hasClickListener: boolean
}

export interface GroupLayerAttribute {
  id: number
  objectid: string
  layerAttributes?: LayerAttribute[]
}

export interface AttributedData<T> {
  id: number
  attributes: T
}

export enum LayerType {
  ElevationLayer = 'ElevationLayer',
  FeatureLayer = 'FeatureLayer',
  IntegratedMeshLayer = 'IntegratedMeshLayer',
  TileLayer = 'TileLayer',
  SceneLayer = 'SceneLayer',
  WMTSLayer = 'WMTSLayer',
  BuildingSceneLayer = 'BuildingSceneLayer'
}

export enum LayerPriorityLoading {
  HIGH = 'HIGH',
  MIDDLE = 'MIDDLE',
  LOW = 'LOW'
}

export interface LayerAttribute {
  id: number
  key: string
  file?: { data: AttributedData<Image> | null }
  type: LayerAttributeType
  stringValue: string | null
  numberValue: number | null
  booleanValue: boolean | null
  dateValue: string | null
}

export enum LayerAttributeType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  date = 'date',
  file = 'file',
  link = 'link'
}

export interface Pagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}
export interface BackendFindResponse<T> {
  data: T[]
  meta: { pagination: Pagination }
}

export interface BackendFindOneResponse<T> {
  data: T
  meta: any
}

export interface QueryParams {
  sort: string | string[]
  filters: Record<string, any>
  populate: string | string[] | Record<string, any>
  fields: string[]
  pagination: Partial<{ page: number, pageSize: number, withCount: boolean }>
  locale: string | string[]
  publicationState: 'live' | 'preview'
}

export interface ArcGisToken {
  expires: number
  ssl: boolean
  token: string
}

export interface Image {
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: Record<string, any> | null
  createdAt: string
  updatedAt: string
}
