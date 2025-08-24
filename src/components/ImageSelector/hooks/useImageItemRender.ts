import { useCallback } from 'react'

import { ImageItemRenderProps } from '../components'
import { ImageSelectorProps } from '../types'

type UseImageItemRenderProps = Pick<ImageSelectorProps, 'onActiveImageItemChange' | 'onDeleteImageItem'>

export function useImageItemRender(props: UseImageItemRenderProps) {
  const { onActiveImageItemChange, onDeleteImageItem } = props

  const handleActiveImageItem = useCallback<ImageItemRenderProps['onActive']>(
    (imageItem) => {
      onActiveImageItemChange(imageItem)
    },
    [onActiveImageItemChange],
  )

  const handleDeleteImageItem = useCallback<ImageItemRenderProps['onDelete']>(
    (imageItem) => {
      onDeleteImageItem(imageItem)
    },
    [onDeleteImageItem],
  )

  return { handleActiveImageItem, handleDeleteImageItem }
}
