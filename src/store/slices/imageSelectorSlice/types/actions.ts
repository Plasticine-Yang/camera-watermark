import { ImageItem } from '@/types'

export interface ImageSelectorSliceActions {
  setActiveImageItem: (imageItem: ImageItem) => void
  deleteImageItem: (imageItem: ImageItem) => void
  appendImageItemList: (imageItemList: ImageItem[]) => void
}
