import { memo, useCallback, useRef } from 'react'
import Zoom from '@arcgis/core/widgets/Zoom'
import { IconButton } from './IconButton'
import { useSceneView } from './ArcGisMap'
import { useEffectOnce } from 'usehooks-ts'

export const MapZoom = memo(() => {
  const sceneView = useSceneView()
  const zoom = useRef(new Zoom({ view: sceneView, visible: false }))

  useEffectOnce(() => {
    return () => {
      zoom.current.destroy()
    }
  })

  const zoomIn = useCallback(() => {
    zoom.current.zoomIn()
  }, [])
  const zoomOut = useCallback(() => {
    zoom.current.zoomOut()
  }, [])

  return (
      <>
          <IconButton onClick={zoomIn} style={{ height: 25, width: 25 }}>
              <img src="/images/plus.png" alt="plus" />
          </IconButton>
          <IconButton onClick={zoomOut} style={{ height: 25, width: 25 }}>
              <img src="/images/minus.png" alt="minus" />
          </IconButton>
      </>
  )
})
