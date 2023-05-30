import {
  type FC,
  useRef
} from 'react'
import {
  ElevationLayer,
  Map,
  MapSettings,
  SceneView
} from '../components/ArcGisMap'
import {
  useDispatch,
  useSelector
} from '../store'
import { arcgisApiKeySelector } from '../slices/settingsSlice'
import { fetchLayersData } from '../slices/layerSlice'
import { useEffectOnce } from 'usehooks-ts'
import type ArcSceneView from '@arcgis/core/views/SceneView'
import { MapWidgetBlock } from '../components/MapWidgetBlock'
import { MapTime } from '../components/MapTime'
import { MapLayerList } from '../components/MapLayerList'
import { MapZoom } from '../components/MapZoom'
import { MapCompass } from '../components/MapCompass'
import { MapNavigation } from '../components/MapNavigation'
import { Layers } from './Layers'

export const BuildingView: FC = () => {
  const sceneView = useRef<ArcSceneView>()
  const dispatch = useDispatch()
  const arcgisApiKey = useSelector(arcgisApiKeySelector)
  useEffectOnce(() => {
    dispatch(fetchLayersData())
  })
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
                  <Layers />
                   <ElevationLayer
                      url="https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
                   />
                  <MapWidgetBlock position="top-right">
                      <MapTime />
                      <MapLayerList />
                  </MapWidgetBlock>
                  <MapWidgetBlock position="top-left">
                      <MapZoom />
                      <MapCompass />
                      <MapNavigation />
                  </MapWidgetBlock>
              </SceneView>
          </Map>
      </MapSettings>
  )
}
