import {
  createContext,
  useContext,
  type PropsWithChildren,
  forwardRef,
  useRef,
  useImperativeHandle,
  memo
} from 'react'
import ArcGraphic from '@arcgis/core/Graphic'
import usePrevious from './hooks/usePrevious'
import {
  useEffectOnce,
  useUpdateEffect
} from 'usehooks-ts'
import { useMapView } from './MapView'
import { getPropsDiffs } from './utils/getPropsDiffs'

type Props = ConstructorParameters<typeof ArcGraphic>[0]

const MapGraphicContext = createContext<ArcGraphic | undefined>(undefined)
export const useGraphic = (): ArcGraphic => useContext(MapGraphicContext)!

export const Graphic = memo<PropsWithChildren<Props>>(
  forwardRef<ArcGraphic | undefined, PropsWithChildren<Props>>(({ children, ...props }, forwardedRef) => {
    const innerRef = useRef<ArcGraphic>(new ArcGraphic({ ...props }))
    const prevProps = usePrevious(props)
    const mapView = useMapView()
    useImperativeHandle(forwardedRef, () => innerRef.current, [props])
    useEffectOnce(() => {
      mapView.graphics.add(innerRef.current)
      return () => {
        innerRef.current.destroy()
      }
    })
    useUpdateEffect(() => {
      const diffs = getPropsDiffs(prevProps, props)
      diffs.forEach((key) => {
        innerRef.current.set(key, props[key])
      })
    }, [props])
    return (
        <MapGraphicContext.Provider value={innerRef.current}>
            {children}
        </MapGraphicContext.Provider>
    )
  })
)
