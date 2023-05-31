import {
  type FC,
  Fragment, useCallback
} from 'react'
import {
  ElevationLayer,
  FeatureLayer,
  GroupLayer,
  IntegratedMeshLayer,
  SceneLayer
} from '../components/ArcGisMap'
import { type Image, LayerType } from '../types'
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer'
import PointSymbol3D from '@arcgis/core/symbols/PointSymbol3D'
import { buildImageUrl } from '../utils'
import { withClickHandleLayer } from '../hocs/withClickHandleLayer'
import { withSwitchVisibleLayer } from '../hocs/withSwitchVisibleLayer'
import { useSelector } from '../store'
import { groupLayersDataSelector } from '../slices/layerSlice'
import { arcgisTokenSelector } from '../slices/settingsSlice'

const ClickHandledSwitchVisibleSceneLayer = withClickHandleLayer(withSwitchVisibleLayer(SceneLayer))
const SwitchVisibleSceneLayer = withSwitchVisibleLayer(SceneLayer)
const SwitchVisibleFeatureLayer = withSwitchVisibleLayer(FeatureLayer)
const ClickHandledSwitchVisibleFeatureLayer = withClickHandleLayer(withSwitchVisibleLayer(FeatureLayer))
const SwitchVisibleIntegratedMeshLayer = withSwitchVisibleLayer(IntegratedMeshLayer)

export const Layers: FC = () => {
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
                                  layer.attributes.hasClickListener
                                    ? <ClickHandledSwitchVisibleSceneLayer
                                            url={layer.attributes.url}
                                            apiKey={arcgisToken.token}
                                            opacity={layer.attributes.opacity}
                                            clickedLayerId={layer.id}
                                            visibleLayerId={layer.id}
                                        />
                                    : <SwitchVisibleSceneLayer
                                            visibleLayerId={layer.id}
                                            url={layer.attributes.url}
                                            apiKey={arcgisToken.token}
                                            opacity={layer.attributes.opacity}
                                        />
                                )}
                                {layer.attributes.type === LayerType.IntegratedMeshLayer && (
                                    <SwitchVisibleIntegratedMeshLayer
                                        visibleLayerId={layer.id}
                                        url={layer.attributes.url}
                                        apiKey={arcgisToken.token}
                                        opacity={layer.attributes.opacity}
                                    />
                                )}
                                {layer.attributes.type === LayerType.FeatureLayer && (
                                  layer.attributes.hasClickListener
                                    ? <ClickHandledSwitchVisibleFeatureLayer
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
                                    : <SwitchVisibleFeatureLayer
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
}
