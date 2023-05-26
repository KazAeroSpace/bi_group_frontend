import {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef
} from 'react'
import ArcIntegratedMeshLayer from '@arcgis/core/layers/IntegratedMeshLayer'
import usePrevious from './hooks/usePrevious'
import { useMap } from './Map'
import {
  useEffectOnce,
  useUpdateEffect
} from 'usehooks-ts'
import { getPropsDiffs } from './utils/getPropsDiffs'
import { useGroupLayer } from './GroupLayer'

type Props = NonNullable<ConstructorParameters<typeof ArcIntegratedMeshLayer>[0]>
export const IntegratedMeshLayer = memo<Props>(forwardRef<ArcIntegratedMeshLayer | undefined, Props>((props, ref) => {
  const innerRef = useRef<ArcIntegratedMeshLayer>(new ArcIntegratedMeshLayer({ ...props }))
  const prevProps = usePrevious<Props>(props)
  const group = useGroupLayer()
  const map = useMap()
  useImperativeHandle(ref, () => innerRef.current, [props])
  useEffectOnce(() => {
    if (group) {
      group.layers.add(innerRef.current)
    } else {
      map.layers.add(innerRef.current)
    }
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
