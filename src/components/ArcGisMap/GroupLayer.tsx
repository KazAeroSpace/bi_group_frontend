import { createContext, forwardRef, memo, useContext, useImperativeHandle, useRef, type PropsWithChildren } from 'react'
import ArcGroupLayer from '@arcgis/core/layers/GroupLayer.js'
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts'
import { useMap } from './Map'
import usePrevious from './hooks/usePrevious'
import { getPropsDiffs } from './utils/getPropsDiffs'

type Props = NonNullable<ConstructorParameters<typeof ArcGroupLayer>[0]>

const GroupLayerContext = createContext<ArcGroupLayer | undefined>(undefined)

export const useGroupLayer = (): ArcGroupLayer | undefined => useContext(GroupLayerContext)
export const GroupLayer = memo(
  forwardRef<ArcGroupLayer | undefined, PropsWithChildren<Props>>(({ children, ...props }, ref) => {
    const map = useMap()
    const innerRef = useRef<ArcGroupLayer>(new ArcGroupLayer({ ...props }))
    const prevProps = usePrevious<Props>(props)
    useImperativeHandle(ref, () => innerRef.current, [props])
    useEffectOnce(() => {
      map.layers.add(innerRef.current)
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
        <GroupLayerContext.Provider value={innerRef.current}>
            {children}
        </GroupLayerContext.Provider>
    )
  })
)
