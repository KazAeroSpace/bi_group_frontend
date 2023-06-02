import {
  memo,
  Fragment,
  useCallback
} from 'react'
import {
  ElevationLayer,
  FeatureLayer as DefaultFeatureLayer,
  GroupLayer,
  IntegratedMeshLayer as DefaultIntegratedMeshLayer,
  SceneLayer as DefaultSceneLayer
} from '../components/ArcGisMap'
import {
  type Image,
  LayerType
} from '../types'
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer'
import PointSymbol3D from '@arcgis/core/symbols/PointSymbol3D'
import {
  buildImageUrl,
  pipe
} from '../utils'
import { withClickHandleLayer } from '../hocs/withClickHandleLayer'
import { withSwitchVisibleLayer } from '../hocs/withSwitchVisibleLayer'
import { useSelector } from '../store'
import { groupLayersDataSelector } from '../slices/layerSlice'
import { arcgisTokenSelector } from '../slices/settingsSlice'
import { withHighlightLayer } from '../hocs/withHighlightLayer'

const pipedHocs = pipe(
  withClickHandleLayer,
  withSwitchVisibleLayer,
  withHighlightLayer
)
const SceneLayer = pipedHocs(DefaultSceneLayer)
const FeatureLayer = pipedHocs(DefaultFeatureLayer)
const IntegratedMeshLayer = pipedHocs(DefaultIntegratedMeshLayer)

export const Layers = memo(() => {
  const arcgisToken = useSelector(arcgisTokenSelector)
  const groupLayersData = useSelector(groupLayersDataSelector)
  if (!arcgisToken) {
    return null
  }
  const createSimpleRenderer = useCallback((image: Image) => {
    return new SimpleRenderer({
      visualVariables: [],
      symbol: new PointSymbol3D({
        symbolLayers: [
          {
            type: 'icon',
            material: {
              color: 'white'
            },
            resource: {
              href: buildImageUrl(image)
            },
            size: 15,
            outline: {
              color: 'white',
              size: 2
            },
            anchor: 'center'
          }]
      })
    })
  }, [])
  return (
        <>
            {groupLayersData
              .map(([group, layers]) => (
                    <GroupLayer key={group}>
                        {layers.map((layer) => (
                            <Fragment key={layer.id}>
                                {layer.attributes.type === LayerType.SceneLayer && (
                                    <SceneLayer
                                        url={layer.attributes.url}
                                        apiKey={arcgisToken.token}
                                        opacity={layer.attributes.opacity}
                                        clickedLayerId={layer.id}
                                        visibleLayerId={layer.id}
                                        highlightLayerId={layer.id}
                                    />
                                )}
                                {layer.attributes.type === LayerType.IntegratedMeshLayer && (
                                    <IntegratedMeshLayer
                                        visibleLayerId={layer.id}
                                        url={layer.attributes.url}
                                        apiKey={arcgisToken.token}
                                        opacity={layer.attributes.opacity}
                                        clickedLayerId={layer.id}
                                    />
                                )}
                                {layer.attributes.type === LayerType.FeatureLayer && (
                                    <FeatureLayer
                                        clickedLayerId={layer.id}
                                        visibleLayerId={layer.id}
                                        url={layer.attributes.url}
                                        apiKey={arcgisToken.token}
                                        opacity={layer.attributes.opacity}
                                        elevationInfo={{
                                          mode: 'relative-to-scene'
                                        }}
                                        screenSizePerspectiveEnabled={false}
                                        renderer={
                                          layer.attributes.icon?.data
                                            ? createSimpleRenderer(layer.attributes.icon.data.attributes)
                                            : undefined
                                        }
                                    />
                                )}
                            </Fragment>
                        ))}
                    </GroupLayer>
              ))}
            <ElevationLayer
                url="https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
            />
        </>
  )
})
