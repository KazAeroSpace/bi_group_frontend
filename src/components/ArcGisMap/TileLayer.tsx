import {
  memo,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import { useMap } from './Map'
import ArcTileLayer from '@arcgis/core/layers/TileLayer'
import usePrevious from './hooks/usePrevious'
import {
  useEffectOnce,
  useUpdateEffect
} from 'usehooks-ts'
import { getPropsDiffs } from './utils/getPropsDiffs'
import { useGroupLayer } from './GroupLayer'

type Props = NonNullable<ConstructorParameters<typeof ArcTileLayer>[0]>
export const TileLayer = memo(forwardRef<ArcTileLayer | undefined, Props>((props, ref) => {
  const innerRef = useRef<ArcTileLayer>(new ArcTileLayer({ ...props }))
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
