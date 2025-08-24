import { ImageItem } from '@/types'

export function isImageItemEqual(imageItemA: ImageItem, imageItemB: ImageItem) {
  return imageItemA.filePath === imageItemB.filePath
}
