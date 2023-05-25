import {
  type FC,
  Fragment,
  useMemo,
  useRef
} from 'react'
import {
  ElevationLayer,
  FeatureLayer,
  IntegratedMeshLayer,
  Map,
  MapSettings,
  SceneLayer,
  SceneView
} from '../components/ArcGisMap'
import {
  useDispatch,
  useSelector
} from '../store'
import {
  arcgisApiKeySelector,
  arcgisTokenSelector
} from '../slices/settingsSlice'
import {
  fetchLayersData,
  layersDataSelector
} from '../slices/layerSlice'
import { LayerType } from '../types'
import { useEffectOnce } from 'usehooks-ts'
import type ArcSceneView from '@arcgis/core/views/SceneView'
import { MapControls } from './MapControls'
import { useFindInfoFromClickOnSceneView } from '../hooks/useFindInfoFromClickOnSceneView'

export const BuildingView: FC = () => {
  const sceneView = useRef<ArcSceneView>()
  const dispatch = useDispatch()
  const arcgisApiKey = useSelector(arcgisApiKeySelector)
  const layersData = useSelector(layersDataSelector)
  const arcgisToken = useSelector(arcgisTokenSelector)
  useEffectOnce(() => {
    dispatch(fetchLayersData())
  })
  useFindInfoFromClickOnSceneView(sceneView)
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const layers = useMemo(() => {
    return layersData.map((layer) => (
            <Fragment key={layer.id}>
                {layer.attributes.type === LayerType.SceneLayer && (
                    <SceneLayer
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
                          mode: 'relative-to-ground'
                        }}
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
              basemap="arcgis-light-gray"
              ground={{
                surfaceColor: [255, 255, 255, 0.2]
              }}
          >
              <SceneView
                  ref={sceneView}
                  style={{
                    height: '100vh',
                    width: '100vw'
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
                    }
                  }}
              >
                  {arcgisToken && layers}
                  <ElevationLayer
                      url="https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
                  />
                  <MapControls />
              </SceneView>
          </Map>
      </MapSettings>
  )
}
