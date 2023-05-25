import { type Attributes, type ComponentType, useRef } from 'react'
import type Layer from '@arcgis/core/layers/Layer'
import { type LayerPriorityLoading } from '../types'

interface Props {
  id: number
  priority: LayerPriorityLoading
}

export function withPriorityLoading<P> (Component: ComponentType<P>): ComponentType<P & Props> {
  return (props) => {
    const { id, priority, ...other } = props
    const ref = useRef<Layer>()
    return (
        <Component ref={ref} {...other as Attributes & P} />
    )
  }
}
