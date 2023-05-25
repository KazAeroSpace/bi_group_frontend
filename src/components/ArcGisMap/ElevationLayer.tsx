import ArcElevationLayer from '@arcgis/core/layers/ElevationLayer.js'
import {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef
} from 'react'
import usePrevious from './hooks/usePrevious'
import { useMap } from './Map'
import {
  useEffectOnce,
  useUpdateEffect
} from 'usehooks-ts'
import { getPropsDiffs } from './utils/getPropsDiffs'

type Props = NonNullable<ConstructorParameters<typeof ArcElevationLayer>[0]>
export const ElevationLayer = memo<Props>(forwardRef<ArcElevationLayer | undefined, Props>((props, ref) => {
  const innerRef = useRef<ArcElevationLayer>(new ArcElevationLayer({ ...props }))
  const prevProps = usePrevious<Props>(props)
  const map = useMap()
  useImperativeHandle(ref, () => innerRef.current, [props])
  useEffectOnce(() => {
    map.ground.layers.add(innerRef.current)
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
  return null
}))
