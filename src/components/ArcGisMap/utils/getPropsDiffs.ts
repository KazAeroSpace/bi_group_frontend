import { isEqual } from 'lodash'

export function getPropsDiffs<P> (prevProps: P, nextProps: P): Array<keyof P> {
  const result = []
  for (const key in nextProps) {
    if (!Object.keys(prevProps as any).includes(key) || !isEqual(prevProps[key], nextProps[key])) {
      result.push(key)
    }
  }
  return result
}
