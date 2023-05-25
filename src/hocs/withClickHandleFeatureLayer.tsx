import { type Attributes, type ComponentType } from 'react'

interface Props {
  objectid: string | null
}
export function withClickHandleFeatureLayer<P> (Component: ComponentType<P>): ComponentType<P & Props> {
  return (props) => {
    const { objectid, ...other } = props
    return (
        <Component {...other as Attributes & P} />
    )
  }
}
