import {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef
} from 'react'
import { useMap } from './Map'
import usePrevious from './hooks/usePrevious'
import ArcSceneLayer from '@arcgis/core/layers/SceneLayer.js'
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts'
import { getPropsDiffs } from './utils/getPropsDiffs'
import { useGroupLayer } from './GroupLayer'

type Props = NonNullable<ConstructorParameters<typeof ArcSceneLayer>[0]>
export const SceneLayer = memo(
  forwardRef<ArcSceneLayer | undefined, Props>((props, ref) => {
    const innerRef = useRef<ArcSceneLayer>(new ArcSceneLayer({ ...props }))
    const prevProps = usePrevious<Props>({ ...props })
    const map = useMap()
    const group = useGroupLayer()
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
  })
)
