import { ImageItem } from '@/types'

export interface ImageSelectorSliceState {
  selectedImageItemList: ImageItem[]
  activeImageItem: ImageItem | null
}
