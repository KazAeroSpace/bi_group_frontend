import {
  createContext,
  memo,
  type PropsWithChildren,
  useContext
} from 'react'
import esriConfig from '@arcgis/core/config'
import { useLoadMapStyle } from './hooks/useLoadMapStyle'
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts'
import { getPropsDiffs } from './utils/getPropsDiffs'
import usePrevious from './hooks/usePrevious'

interface Props {
  theme?: 'light' | 'dark'
  config?: Partial<esriConfig>
}

const MapSettingsContext = createContext<esriConfig>(esriConfig)
export const useMapSettings = (): esriConfig => useContext(MapSettingsContext)
export const MapSettings = memo<PropsWithChildren<Props>>((props) => {
  const { config, theme, children } = props
  const isStyleLoaded = useLoadMapStyle(theme)
  const prevConfig = usePrevious<Partial<esriConfig> | undefined>(props.config)
  useEffectOnce(() => {
    if (config) {
      Object.keys(config).forEach((key) => {
        esriConfig[key as never] = config[key as never]
      })
    }
  })
  useUpdateEffect(() => {
    const diffs = getPropsDiffs(prevConfig, config)
    diffs.forEach((key) => {
      if (config) {
        esriConfig[key] = config[key]
      }
    })
  }, [config])
  return (
        <MapSettingsContext.Provider value={esriConfig}>
            {isStyleLoaded && <>{children}</>}
        </MapSettingsContext.Provider>
  )
})
