import {
  createContext,
  memo,
  type PropsWithChildren,
  useContext,
  useRef
} from 'react'
import ArcMap from '@arcgis/core/Map'
import {
  useEffectOnce,
  useUpdateEffect
} from 'usehooks-ts'
import usePrevious from './hooks/usePrevious'
import { getPropsDiffs } from './utils/getPropsDiffs'

type Props = NonNullable<ConstructorParameters<typeof ArcMap>[0]>

const MapContext = createContext<ArcMap | undefined>(undefined)
export const useMap = (): ArcMap => useContext(MapContext)!
export const Map = memo<PropsWithChildren<Props>>(({ children, ...props }) => {
  const prevProps = usePrevious<Props>(props)
  const ref = useRef<ArcMap>(new ArcMap({ ...props }))
  useEffectOnce(() => {
    return () => {
      ref.current.destroy()
    }
  })
  useUpdateEffect(() => {
    const diffs = getPropsDiffs(prevProps, props)
    diffs.forEach((key) => {
      ref.current.set(key, props[key])
    })
  }, [props])
  return (
      <MapContext.Provider value={ref.current}>
        {children}
      </MapContext.Provider>
  )
})
