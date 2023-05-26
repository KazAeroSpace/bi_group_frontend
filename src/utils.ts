import { type Image } from './types'

export const buildImageUrl = (image: Image): string => {
  return `${process.env.REACT_APP_BACKEND ?? ''}${image.url}`
}

export function groupBy<K, V> (list: V[], keyGetter: (item: V) => K): Map<K, V[]> {
  const map = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}
