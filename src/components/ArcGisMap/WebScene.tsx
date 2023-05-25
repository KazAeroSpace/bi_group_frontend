import {
  createContext,
  memo,
  type PropsWithChildren,
  useContext,
  useRef
} from 'react'
import ArcWebScene from '@arcgis/core/WebScene'
import {
  useEffectOnce,
  useUpdateEffect
} from 'usehooks-ts'
import usePrevious from './hooks/usePrevious'
import { getPropsDiffs } from './utils/getPropsDiffs'
type Props = NonNullable<ConstructorParameters<typeof ArcWebScene>[0]>
const WebSceneContext = createContext<ArcWebScene | undefined>(undefined)
export const useWebScene = (): ArcWebScene | undefined => useContext(WebSceneContext)
export const WebScene = memo<PropsWithChildren<Props>>(({ children, ...props }) => {
  const prevProps = usePrevious<Props>(props)
  const ref = useRef<ArcWebScene>(new ArcWebScene({ ...props }))
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
      <WebSceneContext.Provider value={ref.current}>
        {children}
      </WebSceneContext.Provider>
  )
})
