import '@arcgis/core/assets/esri/themes/light/main.css'
import {
  type CSSProperties,
  memo,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect, forwardRef, useImperativeHandle
} from 'react'
import ArcMapView from '@arcgis/core/views/MapView'
import { useMap } from './Map'
import usePrevious from './hooks/usePrevious'
import { useUpdateEffect } from 'usehooks-ts'
import { getPropsDiffs } from './utils/getPropsDiffs'

type Props = { style?: CSSProperties } & NonNullable<ConstructorParameters<typeof ArcMapView>[0]>
const MapViewContext = createContext<ArcMapView | undefined>(undefined)
export const useMapView = (): ArcMapView => {
  const mapView = useContext(MapViewContext)
  if (!mapView) {
    throw new Error('useMapView hook must be used inside MapView container')
  }
  return mapView
}
export const MapView = memo(forwardRef<ArcMapView | undefined, PropsWithChildren<Props>>(({ style, children, ...props }, ref) => {
  const prevProps = usePrevious<Props>(props)
  const map = useMap()
  const [mapView, setMapView] = useState<ArcMapView>()
  useImperativeHandle(ref, () => mapView, [mapView, props])
  useEffect(() => {
    return () => {
      mapView?.destroy()
    }
  }, [mapView])
  useUpdateEffect(() => {
    const diffs = getPropsDiffs(prevProps, props)
    diffs.forEach((key) => {
      mapView?.set(key, props[key])
    })
  }, [props])
  const mapRef = useCallback((container: HTMLDivElement | null) => {
    if (container && !mapView) {
      setMapView(new ArcMapView({
        ...props,
        container,
        map
      }))
    }
  }, [])
  const content = mapView
    ? (
          <MapViewContext.Provider value={mapView}>
            {children}
          </MapViewContext.Provider>
      )
    : null
  return (
      <div ref={mapRef} style={style}>
        {content}
      </div>
  )
}))
