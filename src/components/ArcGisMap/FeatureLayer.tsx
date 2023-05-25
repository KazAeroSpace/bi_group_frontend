import ArcFeatureLayer from '@arcgis/core/layers/FeatureLayer'
import {
  memo,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import { useMap } from './Map'
import usePrevious from './hooks/usePrevious'
import {
  useEffectOnce,
  useUpdateEffect
} from 'usehooks-ts'
import { getPropsDiffs } from './utils/getPropsDiffs'

type Props = NonNullable<ConstructorParameters<typeof ArcFeatureLayer>[0]>
export const FeatureLayer = memo(forwardRef<ArcFeatureLayer | undefined, Props>((props, ref) => {
  const innerRef = useRef<ArcFeatureLayer>(new ArcFeatureLayer({ ...props }))
  const prevProps = usePrevious<Props>(props)
  const map = useMap()
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
  return null
}))
