import { type Image } from './types'

export const buildImageUrl = (image: Image): string => {
  return `${process.env.REACT_APP_BACKEND ?? ''}${image.url}`
}
