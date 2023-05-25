import { forwardRef, memo, useImperativeHandle, useRef } from 'react'
import ArcWMTSLayer from '@arcgis/core/layers/WMTSLayer'
import usePrevious from './hooks/usePrevious'
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts'
import { getPropsDiffs } from './utils/getPropsDiffs'
import { useMap } from './Map'

type Props = NonNullable<ConstructorParameters<typeof ArcWMTSLayer>[0]>

export const WMTSLayer = memo(
  forwardRef<ArcWMTSLayer | undefined, Props>((props, ref) => {
    const map = useMap()
    const innerRef = useRef<ArcWMTSLayer>(new ArcWMTSLayer({ ...props }))
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
        innerRef.current?.set(key, props[key])
      })
    }, [props])
    return null
  })
)
