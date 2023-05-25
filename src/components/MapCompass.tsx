import { memo, useCallback, useRef } from 'react'
import { IconButton } from './IconButton'
import Compass from '@arcgis/core/widgets/Compass'
import { useSceneView } from './ArcGisMap'

export const MapCompass = memo(() => {
  const sceneView = useSceneView()
  const compass = useRef(new Compass({ view: sceneView, visible: false }))
  const resetCompass = useCallback(() => {
    compass.current.reset()
  }, [])
  return (
        <IconButton onClick={resetCompass} style={{ height: 25, width: 25 }}>
            <img src="/images/compass.png" alt="compass" />
        </IconButton>
  )
})
