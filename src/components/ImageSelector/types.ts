import { ImageItem } from '@/types'

export interface ImageSelectorProps {
  activeImageItem: ImageItem | null
  selectedImageItemList: ImageItem[]
  onActiveImageItemChange: (imageItem: ImageItem) => void
  onAppendImageItemList: (imageItemList: ImageItem[]) => void
  onDeleteImageItem: (imageItem: ImageItem) => void
}
