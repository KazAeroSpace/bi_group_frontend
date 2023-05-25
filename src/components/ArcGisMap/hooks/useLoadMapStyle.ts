import { useEffect, useState } from 'react'

export const useLoadMapStyle = (theme?: 'light' | 'dark'): boolean => {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    let cleanup = false
    void (async () => {
      await import(`@arcgis/core/assets/esri/themes/${theme ?? 'light'}/main.css`)
      if (!cleanup) {
        setIsLoaded(true)
      }
    })()
    return () => {
      cleanup = true
    }
  }, [theme])

  return isLoaded
}
