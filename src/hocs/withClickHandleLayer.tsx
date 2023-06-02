import {
  type Attributes,
  type ComponentType,
  forwardRef,
  type ForwardRefExoticComponent,
  memo,
  type MemoExoticComponent,
  type PropsWithoutRef,
  type RefAttributes,
  useImperativeHandle,
  useRef
} from 'react'
import { useEffectOnce } from 'usehooks-ts'
import { useSceneView } from '../components/ArcGisMap'
import {
  useDispatch,
  useSelector
} from '../store'
import {
  fetchClickedLayer,
  layerDataSelector
} from '../slices/layerSlice'
import type ArcLayer from '@arcgis/core/layers/Layer'
import { useExternalMapState } from '../contexts/ExternalMapState'
import Camera from '@arcgis/core/Camera'
import { LayerType } from '../types'

interface Props {
  clickedLayerId: number
}
export function withClickHandleLayer<P> (Component: ComponentType<P>): MemoExoticComponent<ForwardRefExoticComponent<PropsWithoutRef<Props & P> & RefAttributes<ArcLayer | undefined>>> {
  return memo(
    forwardRef<ArcLayer | undefined, Props & P>((props, ref) => {
      const { clickedLayerId, ...other } = props
      const innerRef = useRef<ArcLayer>()
      const dispatch = useDispatch()
      const layerData = useSelector(layerDataSelector(clickedLayerId))
      const sceneView = useSceneView()
      useImperativeHandle(ref, () => innerRef.current, [other])
      const { setTargetToGo } = useExternalMapState()
      useEffectOnce(() => {
        if (layerData?.attributes.hasClickListener) {
          sceneView.on('click', async (event) => {
            try {
              const { x, y } = event
              const response = await sceneView.hitTest({ x, y })
              const result = response.results[0]
              if (result && 'graphic' in result) {
                const groupLayerAttribute = layerData.attributes.groupLayerAttributes?.find(
                  item => item.objectid === result.graphic.attributes.objectid.toString()
                )
                if (groupLayerAttribute) {
                  dispatch(fetchClickedLayer({
                    layerId: layerData.id,
                    groupLayerAttributeId: groupLayerAttribute.id
                  }))
                  if (layerData.attributes.type === LayerType.SceneLayer) {
                    setTargetToGo(new Camera({
                      heading: groupLayerAttribute.heading ?? undefined,
                      position: result.mapPoint,
                      tilt: 90
                    }))
                  }
                }
              }
            } catch (err) {
              console.log(err)
            }
          })
        }
      })
      return (
            <Component ref={innerRef} {...other as Attributes & P} />
      )
    })
  )
}
