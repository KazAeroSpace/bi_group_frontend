import {
  createContext,
  memo,
  type PropsWithChildren,
  useCallback,
  useContext,
  useState
} from 'react'
import { useSceneView } from '../components/ArcGisMap'
interface ExternalMapStateValues {
  targetToGo: any
  triggerTargetToGo: () => void
  setTargetToGo: (camera: any) => void
}
const ExternalMapStateContext = createContext<ExternalMapStateValues>({
  targetToGo: null,
  setTargetToGo: () => {},
  triggerTargetToGo: () => {}
})
export const useExternalMapState = (): ExternalMapStateValues => useContext(ExternalMapStateContext)
export const ExternalMapStateProvider = memo<PropsWithChildren>(({ children }) => {
  const sceneView = useSceneView()
  const [state, setState] = useState<Pick<ExternalMapStateValues, 'targetToGo'>>({
    targetToGo: null
  })
  const triggerTargetToGo = useCallback<ExternalMapStateValues['triggerTargetToGo']>(() => {
    if (state.targetToGo) {
      void sceneView.goTo(state.targetToGo)
      setState((prevState) => ({ ...prevState, targetToGo: null }))
    }
  }, [state.targetToGo, setState])
  const setTargetToGo = useCallback<ExternalMapStateValues['setTargetToGo']>((camera) => {
    setState((prevState) => ({ ...prevState, targetToGo: camera }))
  }, [setState])
  return (
      <ExternalMapStateContext.Provider value={{ ...state, triggerTargetToGo, setTargetToGo }}>
          {children}
      </ExternalMapStateContext.Provider>
  )
})
