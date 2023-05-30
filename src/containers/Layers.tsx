import {
  type FC,
  Fragment
} from 'react'
import {
  ElevationLayer,
  FeatureLayer,
  GroupLayer,
  IntegratedMeshLayer,
  SceneLayer
} from '../components/ArcGisMap'
import { LayerType } from '../types'
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer'
import PointSymbol3D from '@arcgis/core/symbols/PointSymbol3D'
import { buildImageUrl } from '../utils'
import { withClickHandleSceneLayer } from '../hocs/withClickHandleSceneLayer'
import { withSwitchVisibleLayer } from '../hocs/withSwitchVisibleLayer'
import { useSelector } from '../store'
import { groupLayersDataSelector } from '../slices/layerSlice'
import { arcgisTokenSelector } from '../slices/settingsSlice'

const ClickHandledSceneLayer = withClickHandleSceneLayer(SceneLayer)
const SwitchVisibleSceneLayer = withSwitchVisibleLayer(SceneLayer)
const SwitchVisibleFeatureLayer = withSwitchVisibleLayer(FeatureLayer)
const SwitchVisibleIntegratedMeshLayer = withSwitchVisibleLayer(IntegratedMeshLayer)

export const Layers: FC = () => {
  const arcgisToken = useSelector(arcgisTokenSelector)
  const groupLayersData = useSelector(groupLayersDataSelector)
  if (!arcgisToken) {
    return null
  }
  return (
        <>
            {groupLayersData
              .map(([group, layers]) => (
                    <GroupLayer key={group}>
                        {layers.map((layer) => (
                            <Fragment key={layer.id}>
                                {layer.attributes.type === LayerType.SceneLayer && (
                                  layer.attributes.hasClickListener
                                    ? <ClickHandledSceneLayer
                                            url={layer.attributes.url}
                                            apiKey={arcgisToken.token}
                                            opacity={layer.attributes.opacity}
                                            layerId={layer.id}
                                        />
                                    : <SwitchVisibleSceneLayer
                                            layerId={layer.id}
                                            url={layer.attributes.url}
                                            apiKey={arcgisToken.token}
                                            opacity={layer.attributes.opacity}
                                        />
                                )}
                                {layer.attributes.type === LayerType.IntegratedMeshLayer && (
                                    <SwitchVisibleIntegratedMeshLayer
                                        layerId={layer.id}
                                        url={layer.attributes.url}
                                        apiKey={arcgisToken.token}
                                        opacity={layer.attributes.opacity}
                                    />
                                )}
                                {layer.attributes.type === LayerType.FeatureLayer && (
                                    <SwitchVisibleFeatureLayer
                                        layerId={layer.id}
                                        url={layer.attributes.url}
                                        apiKey={arcgisToken.token}
                                        opacity={layer.attributes.opacity}
                                        elevationInfo={{
                                          mode: 'relative-to-scene'
                                        }}
                                        screenSizePerspectiveEnabled={false}
                                        renderer={layer.attributes.icon?.data
                                          ? new SimpleRenderer({
                                            visualVariables: [],
                                            symbol: new PointSymbol3D({
                                              symbolLayers: [
                                                {
                                                  type: 'icon',
                                                  material: {
                                                    color: 'white'
                                                  },
                                                  resource: {
                                                    href: buildImageUrl(layer.attributes.icon.data.attributes)
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
                                          : undefined}
                                    />
                                )}
                                {layer.attributes.type === LayerType.ElevationLayer && (
                                    <ElevationLayer
                                        url={layer.attributes.url}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </GroupLayer>
              ))}
        </>
  )
}
