import { type Attributes, type ComponentType } from 'react'
import { useEffectOnce } from 'usehooks-ts'
import { useSceneView } from '../components/ArcGisMap'
import { useDispatch, useSelector } from '../store'
import { fetchClickedLayer, layerDataSelector } from '../slices/layerSlice'

interface Props {
  layerId: number
}
export function withClickHandleSceneLayer<P> (Component: ComponentType<P>): ComponentType<P & Props> {
  return (props) => {
    const { layerId, ...other } = props
    const dispatch = useDispatch()
    const layerData = useSelector(layerDataSelector(layerId))
    const sceneView = useSceneView()
    useEffectOnce(() => {
      if (layerData) {
        sceneView.on('click', async (event) => {
          try {
            const response = await sceneView.hitTest({
              x: event.x,
              y: event.y
            })
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
                void sceneView.goTo({
                  target: result.graphic,
                  tilt: 90
                })
              }
            }
          } catch (err) {
            console.log(err)
          }
        })
      }
    })
    return (
        <Component {...other as Attributes & P} />
    )
  }
}