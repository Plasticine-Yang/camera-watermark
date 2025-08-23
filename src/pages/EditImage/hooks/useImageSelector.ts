import { useCallback } from 'react'
import { useShallow } from 'zustand/shallow'

import { ImageSelectorProps } from '@/components'
import { useCameraWatermarkStore } from '@/store'

export function useImageSelectorProps() {
  const selectedImageFilePathList = useCameraWatermarkStore(useShallow((state) => state.selectedImageFilePathList))

  const { activeImageFilePath, setActiveImageFilePath, appendImageFilePath, deleteImageFilePath } =
    useCameraWatermarkStore(
      useShallow((state) => ({
        activeImageFilePath: state.activeImageFilePath,
        appendImageFilePath: state.appendImageFilePath,
        deleteImageFilePath: state.deleteImageFilePath,
        setActiveImageFilePath: state.setActiveImageFilePath,
      })),
    )

  const handleActiveImageFilePathChange = useCallback<ImageSelectorProps['onActiveImageFilePathChange']>(
    (newActiveImageFilePath) => {
      setActiveImageFilePath(newActiveImageFilePath)
    },
    [setActiveImageFilePath],
  )

  const handleAppendImageFilePath = useCallback<ImageSelectorProps['onAppendImageFilePath']>(
    (imageFilePath) => {
      appendImageFilePath(imageFilePath)
    },
    [appendImageFilePath],
  )

  const handleDeleteImageFilePath = useCallback<ImageSelectorProps['onDeleteImageFilePath']>(
    (imageFilePath) => {
      deleteImageFilePath(imageFilePath)
    },
    [deleteImageFilePath],
  )

  return {
    activeImageFilePath,
    selectedImageFilePathList,
    handleActiveImageFilePathChange,
    handleAppendImageFilePath,
    handleDeleteImageFilePath,
  }
}
