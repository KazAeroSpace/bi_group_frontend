import {
  type Attributes,
  type ComponentType,
  forwardRef,
  type ForwardRefExoticComponent,
  memo,
  type MemoExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react'
import type ArcLayer from '@arcgis/core/layers/Layer'
import { useSceneView } from '../components/ArcGisMap'
import { useSelector } from '../store'
import { layerDataSelector } from '../slices/layerSlice'

interface Props {
  highlightLayerId: number
}

export function withHighlightLayer<P> (Component: ComponentType<P>): MemoExoticComponent<ForwardRefExoticComponent<PropsWithoutRef<Props & P> & RefAttributes<ArcLayer | undefined>>> {
  return (
    memo(
      forwardRef<ArcLayer | undefined, Props & P>((props, ref) => {
        const sceneView = useSceneView()
        const innerRef = useRef<ArcLayer>()
        const { highlightLayerId, ...other } = props
        const layerData = useSelector(layerDataSelector(highlightLayerId))
        useImperativeHandle(ref, () => innerRef.current, [other])
        useEffect(() => {
          if (innerRef.current && layerData?.attributes.highlightOnClick) {
            sceneView.on('click', async (event) => {
              try {
                const { x, y } = event
                const response = await sceneView.hitTest({ x, y })
                const result = response.results[0]
                if (result && 'graphic' in result && result.graphic.layer === innerRef.current) {
                  /* empty */
                }
              } catch (err) {
                console.log(err)
              }
            })
          }
        }, [innerRef.current])
        return (
          <Component ref={innerRef} {...other as Attributes & P} />
        )
      })
    )
  )
}
