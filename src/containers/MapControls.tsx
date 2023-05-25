import { memo, useRef } from 'react'
import { useSceneView } from '../components/ArcGisMap'
import { useEffectOnce } from 'usehooks-ts'
import styled from '@emotion/styled'
import { MapZoom } from '../components/MapZoom'
import { MapCompass } from '../components/MapCompass'
import { MapNavigation } from '../components/MapNavigation'

const MapControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  box-shadow: none !important;
  & * {
    margin-bottom: 10px;
  }
  & *:last-of-type {
    margin-bottom: 0;
  }
`

export const MapControls = memo(() => {
  const sceneView = useSceneView()
  const ref = useRef<HTMLDivElement>(null)
  useEffectOnce(() => {
    sceneView.ui?.add(ref.current as HTMLDivElement, 'top-left')
    return () => {
      sceneView.ui?.remove(ref.current as HTMLDivElement)
    }
  })
  return (
        <MapControlsContainer ref={ref}>
            <MapZoom />
            <MapCompass />
            <MapNavigation />
        </MapControlsContainer>
  )
})
