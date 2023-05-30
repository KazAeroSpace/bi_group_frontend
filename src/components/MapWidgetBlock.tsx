import {
  memo,
  type PropsWithChildren,
  useRef
} from 'react'
import { useSceneView } from './ArcGisMap'
import { useEffectOnce } from 'usehooks-ts'
import styled from 'styled-components'

interface Props {
  position: 'bottom-leading' | 'bottom-left' | 'bottom-right' | 'bottom-trailing' | 'top-leading' | 'top-left' | 'top-right' | 'top-trailing' | 'manual'
}

const Container = styled.div`
  background: transparent;
  box-shadow: none !important;
  & * {
    margin-bottom: 10px;
  }
  & *:last-of-type {
    margin-bottom: 0;
  }
`

export const MapWidgetBlock = memo<PropsWithChildren<Props>>(({ position, children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const sceneView = useSceneView()
  useEffectOnce(() => {
    sceneView.ui.add(ref.current as HTMLDivElement, position)
    return () => {
      sceneView.ui.remove(ref.current as HTMLDivElement)
    }
  })
  return (
      <Container ref={ref}>
        {children}
      </Container>
  )
})
