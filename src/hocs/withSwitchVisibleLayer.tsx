import {
  type Attributes,
  type ComponentType,
  forwardRef,
  useEffect,
  useRef,
  type RefAttributes,
  type PropsWithoutRef,
  type ForwardRefExoticComponent,
  useImperativeHandle,
  memo,
  type MemoExoticComponent
} from 'react'
import { useSelector } from '../store'
import { layerIsVisibleSelector } from '../slices/layerSlice'
import { useIsFirstRender } from 'usehooks-ts'
import type ArcLayer from '@arcgis/core/layers/Layer'

interface Props {
  layerId: number
}

export function withSwitchVisibleLayer<P> (Component: ComponentType<P>): MemoExoticComponent<ForwardRefExoticComponent<PropsWithoutRef<Props & P> & RefAttributes<ArcLayer | undefined>>> {
  return memo(
    forwardRef<ArcLayer | undefined, Props & P>((props, ref) => {
      const innerRef = useRef<ArcLayer>()
      const { layerId, ...other } = props
      const isFirst = useIsFirstRender()
      const isVisible = useSelector(layerIsVisibleSelector(layerId))
      useImperativeHandle(ref, () => innerRef.current, [other])
      useEffect(() => {
        if (!isFirst && innerRef.current) {
          innerRef.current.visible = isVisible
        }
      }, [isVisible, innerRef.current, isFirst])
      if (isFirst && !isVisible) {
        return null
      }
      return (
            <Component ref={innerRef} {...other as Attributes & P} />
      )
    })
  )
}
