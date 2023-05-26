import { type FC, Fragment, useMemo, useRef } from 'react'
import {
  ElevationLayer,
  FeatureLayer,
  IntegratedMeshLayer,
  Map,
  MapSettings,
  SceneLayer,
  SceneView
} from '../components/ArcGisMap'
import { useDispatch, useSelector } from '../store'
import { arcgisApiKeySelector, arcgisTokenSelector } from '../slices/settingsSlice'
import { fetchLayersData, layersDataSelector } from '../slices/layerSlice'
import { LayerType } from '../types'
import { useEffectOnce } from 'usehooks-ts'
import type ArcSceneView from '@arcgis/core/views/SceneView'
import { MapTopLeftControls } from './MapTopLeftControls'
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer'
import { buildImageUrl } from '../utils'
import PointSymbol3D from '@arcgis/core/symbols/PointSymbol3D'
import { withClickHandleSceneLayer } from '../hocs/withClickHandleSceneLayer'
import { MapTopRightControls } from './MapTopRightControls'

const ClickHandledSceneLayer = withClickHandleSceneLayer(SceneLayer)

export const BuildingView: FC = () => {
  const sceneView = useRef<ArcSceneView>()
  const dispatch = useDispatch()
  const arcgisApiKey = useSelector(arcgisApiKeySelector)
  const layersData = useSelector(layersDataSelector)
  const arcgisToken = useSelector(arcgisTokenSelector)
  useEffectOnce(() => {
    dispatch(fetchLayersData())
  })
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const layers = useMemo(() => {
    return layersData.map((layer) => (
            <Fragment key={layer.id}>
                {layer.attributes.type === LayerType.SceneLayer && (
                  layer.attributes.hasClickListener
                    ? <ClickHandledSceneLayer
                        url={layer.attributes.url}
                        apiKey={arcgisToken?.token}
                        opacity={layer.attributes.opacity}
                        layerId={layer.id}
                    />
                    : <SceneLayer
                          url={layer.attributes.url}
                          apiKey={arcgisToken?.token}
                          opacity={layer.attributes.opacity}
                      />
                )}
                {layer.attributes.type === LayerType.IntegratedMeshLayer && (
                    <IntegratedMeshLayer
                        url={layer.attributes.url}
                        apiKey={arcgisToken?.token}
                        opacity={layer.attributes.opacity}
                    />
                )}
                {layer.attributes.type === LayerType.FeatureLayer && (
                    <FeatureLayer
                        url={layer.attributes.url}
                        apiKey={arcgisToken?.token}
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
    ))
  }, [layersData])
  return (
      <MapSettings config={{ apiKey: arcgisApiKey }}>
          <Map
              basemap="arcgis-imagery-standard"
              ground={{
                surfaceColor: [255, 255, 255, 0.2]
              }}
          >
              <SceneView
                  ref={sceneView}
                  style={{
                    height: '100vh',
                    width: '100vw',
                    overflow: 'hidden'
                  }}
                  camera={{
                    // @ts-expect-error
                    position: [
                      71.401108,
                      51.123748,
                      1000
                    ],
                    heading: 360,
                    tilt: 70
                  }}
                  viewingMode="local"
                  qualityProfile="high"
                  popup={{
                    autoOpenEnabled: false
                  }}
                  ui={{
                    components: []
                  }}
                  environment={{
                    background: {
                      type: 'color',
                      color: [255, 255, 255, 0.2]
                    },
                    atmosphere: {
                      quality: 'high'
                    },
                    lighting: {
                      date: new Date(),
                      directShadowsEnabled: true
                    }
                  }}
              >
                   {arcgisToken && layers}
                   <ElevationLayer
                      url="https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
                   />
                  <MapTopRightControls />
                  <MapTopLeftControls />
              </SceneView>
          </Map>
      </MapSettings>
  )
}
