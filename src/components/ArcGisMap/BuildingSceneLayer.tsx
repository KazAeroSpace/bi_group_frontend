import { forwardRef, memo, useImperativeHandle, useRef } from 'react'
import ArcBuildingSceneLayer from '@arcgis/core/layers/BuildingSceneLayer.js'
import usePrevious from './hooks/usePrevious'
import { useMap } from './Map'
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts'
import { getPropsDiffs } from './utils/getPropsDiffs'

type Props = NonNullable<ConstructorParameters<typeof ArcBuildingSceneLayer>[0]>

export const BuildingSceneLayer = memo(
  forwardRef<ArcBuildingSceneLayer | undefined, Props>((props, ref) => {
    const innerRef = useRef<ArcBuildingSceneLayer>(new ArcBuildingSceneLayer({ ...props }))
    const prevProps = usePrevious<Props>({ ...props })
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
        innerRef.current?.set(key, props[key])
      })
    }, [props])
    return null
  })
)
