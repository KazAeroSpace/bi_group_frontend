import { memo, useCallback, useRef, useState } from 'react'
import { IconButton } from './IconButton'
import NavigationToggleViewModel from '@arcgis/core/widgets/NavigationToggle/NavigationToggleViewModel'
import { useSceneView } from './ArcGisMap'

export const MapNavigation = memo(() => {
  const sceneView = useSceneView()
  const [navigationMode, setNavigationMode] = useState<'pan' | 'rotate'>('pan')
  const navigation = useRef(new NavigationToggleViewModel({ view: sceneView, navigationMode: 'pan' }))
  const toggleNavigationMode = useCallback(() => {
    navigation.current.toggle()
    setNavigationMode(navigation.current.navigationMode)
  }, [setNavigationMode])
  return (
        <IconButton onClick={toggleNavigationMode} style={{ height: 25, width: 25 }}>
            {navigationMode === 'pan' && (
                <img src="/images/move-selector.png" alt="move" />
            )}
            {navigationMode === 'rotate' && (
                <img src="/images/turn-around.png" alt="turn-around" />
            )}
        </IconButton>
  )
})
