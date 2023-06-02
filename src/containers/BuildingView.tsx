import { type FC } from 'react'
import {
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
import { MapWidgetBlock } from '../components/MapWidgetBlock'
import { MapTime } from '../components/MapTime'
import { MapLayerList } from '../components/MapLayerList'
import { MapZoom } from '../components/MapZoom'
import { MapCompass } from '../components/MapCompass'
import { MapNavigation } from '../components/MapNavigation'
import { Layers } from './Layers'
import { InfoBlock } from './InfoBlock'
import { ExternalMapStateProvider } from '../contexts/ExternalMapState'

export const BuildingView: FC = () => {
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
                  viewingMode="global"
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
                    weather: {
                      type: 'cloudy',
                      cloudCover: 0.8
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
                  <ExternalMapStateProvider>
                      <Layers />
                      <MapWidgetBlock position="top-right">
                          <MapTime />
                          <MapLayerList />
                      </MapWidgetBlock>
                      <MapWidgetBlock position="top-left">
                          <MapZoom />
                          <MapCompass />
                          <MapNavigation />
                      </MapWidgetBlock>
                      <InfoBlock />
                  </ExternalMapStateProvider>
              </SceneView>
          </Map>
      </MapSettings>
  )
}
