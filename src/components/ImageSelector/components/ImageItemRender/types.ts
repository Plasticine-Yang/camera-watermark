import { ImageItem } from '@/types'

export interface ImageItemRenderProps {
  isActive: boolean
  imageItem: ImageItem
  onActive: (imageItem: ImageItem) => void
  onDelete: (imageItem: ImageItem) => void
}
