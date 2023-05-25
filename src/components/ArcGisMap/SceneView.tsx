import {
  createContext,
  type CSSProperties, forwardRef,
  memo,
  type PropsWithChildren,
  useCallback,
  useContext, useEffect, useImperativeHandle,
  useState
} from 'react'
import usePrevious from './hooks/usePrevious'
import ArcSceneView from '@arcgis/core/views/SceneView'
import { useMap } from './Map'
import { useUpdateEffect } from 'usehooks-ts'
import { getPropsDiffs } from './utils/getPropsDiffs'

type Props = { style?: CSSProperties } & NonNullable<ConstructorParameters<typeof ArcSceneView>[0]>

const SceneViewContext = createContext<ArcSceneView | undefined>(undefined)
export const useSceneView = (): ArcSceneView => useContext(SceneViewContext)!
export const SceneView = memo(forwardRef<ArcSceneView | undefined, PropsWithChildren<Props>>(({ children, style, ...props }, ref) => {
  const prevProps = usePrevious<Props>(props)
  const map = useMap()
  const [sceneView, setSceneView] = useState<ArcSceneView>()
  useImperativeHandle(ref, () => sceneView, [sceneView, props])
  useEffect(() => {
    return () => {
      sceneView?.destroy()
    }
  }, [sceneView])
  useUpdateEffect(() => {
    const diffs = getPropsDiffs(prevProps, props)
    diffs.forEach((key) => {
      sceneView?.set(key, props[key])
    })
  }, [props])
  const mapRef = useCallback((container: HTMLDivElement | null) => {
    if (container && !sceneView) {
      setSceneView(new ArcSceneView({
        ...props,
        container,
        map
      }))
    }
  }, [])
  const content = sceneView
    ? (
          <SceneViewContext.Provider value={sceneView}>
            {children}
          </SceneViewContext.Provider>
      )
    : null
  return (
      <div ref={mapRef} style={style} >
        {content}
      </div>
  )
}))
