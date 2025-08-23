import { useCallback } from 'react'

import { ImageItemProps } from '../components'
import { ImageSelectorProps } from '../types'

type UseImageItemProps = Pick<ImageSelectorProps, 'onActiveImageFilePathChange' | 'onDeleteImageFilePath'>

export function useImageItem(props: UseImageItemProps) {
  const { onActiveImageFilePathChange, onDeleteImageFilePath } = props

  const handleActiveImageItem = useCallback<ImageItemProps['onActive']>(
    (imageFilePath) => {
      onActiveImageFilePathChange(imageFilePath)
    },
    [onActiveImageFilePathChange],
  )

  const handleDeleteImageItem = useCallback<ImageItemProps['onDelete']>(
    (imageFilePath) => {
      onDeleteImageFilePath(imageFilePath)
    },
    [onDeleteImageFilePath],
  )

  return { handleActiveImageItem, handleDeleteImageItem }
}
