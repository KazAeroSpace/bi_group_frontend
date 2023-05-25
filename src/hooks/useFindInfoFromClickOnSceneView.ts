import type ArcSceneView from '@arcgis/core/views/SceneView'
import {
  type MutableRefObject,
  useEffect
} from 'react'
import {
  fetchClickedLayer,
  layersDataSelector
} from '../slices/layerSlice'
import {
  useDispatch,
  useSelector
} from '../store'

export const useFindInfoFromClickOnSceneView = (sceneViewRef: MutableRefObject<ArcSceneView | undefined>): void => {
  const dispatch = useDispatch()
  const layersData = useSelector(layersDataSelector)
  useEffect(() => {
    if (sceneViewRef.current) {
      sceneViewRef.current.on('click', async (event) => {
        try {
          const response = await sceneViewRef.current?.hitTest({
            x: event.x,
            y: event.y
          })
          if (response?.results && response.results.length >= 2) {
            const objectIds = response.results.slice(0, 2).map(result => {
              if ('graphic' in result) {
                return result.graphic.attributes.objectid.toString()
              }
              return ''
            }) as string[]
            const layerData = layersData.find(layer => layer.attributes.objectid === objectIds[1])
            if (layerData?.attributes.groupLayerAttributes) {
              const groupLayerAttribute = layerData.attributes.groupLayerAttributes.find(
                item => item.objectid === objectIds[0]
              )
              if (groupLayerAttribute) {
                dispatch(fetchClickedLayer({
                  layerId: layerData.id,
                  groupLayerAttributeId: groupLayerAttribute.id
                }))
                const result = response.results[0]
                if ('graphic' in result) {
                  // result.layer
                  void sceneViewRef.current?.goTo({
                    target: result.graphic,
                    tilt: 90
                  })
                }
              }
            }
          }
        } catch (err) {
          console.log(err)
        }
      })
    }
  }, [sceneViewRef.current])
}
