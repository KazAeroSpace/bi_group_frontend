import { type FC, useRef } from 'react'
import { useSceneView } from '../components/ArcGisMap'
import { useEffectOnce } from 'usehooks-ts'
import { MapTime } from '../components/MapTime'
import styled from '@emotion/styled'

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

export const MapTopRightControls: FC = () => {
  const sceneView = useSceneView()
  const ref = useRef<HTMLDivElement>(null)
  useEffectOnce(() => {
    sceneView.ui?.add(ref.current as HTMLDivElement, 'top-right')
    return () => {
      sceneView.ui?.remove(ref.current as HTMLDivElement)
    }
  })
  return (
      <MapControlsContainer ref={ref}>
        <MapTime />
      </MapControlsContainer>
  )
}
