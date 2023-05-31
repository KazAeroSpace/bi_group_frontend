import { type FC } from 'react'
import { BuildingView } from './containers/BuildingView'
import { useEffectOnce } from 'usehooks-ts'
import { useDispatch, useSelector } from './store'
import { initialize, initializedSelector } from './slices/settingsSlice'
import { Toaster } from 'react-hot-toast'

export const App: FC = () => {
  const dispatch = useDispatch()
  const initialized = useSelector(initializedSelector)
  useEffectOnce(() => {
    dispatch(initialize())
  })
  return (
      <>
          {initialized && <BuildingView />}
          <Toaster
              position="bottom-left"
              toastOptions={{
                className: '',
                style: {
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 16,
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }
              }}
          />
      </>
  )
}
