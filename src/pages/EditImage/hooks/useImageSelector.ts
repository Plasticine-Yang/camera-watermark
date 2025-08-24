import { useCallback } from 'react'
import { useShallow } from 'zustand/shallow'

import { ImageSelectorProps } from '@/components'
import { useCameraWatermarkStore } from '@/store'

export function useImageSelector() {
  const selectedImageItemList = useCameraWatermarkStore(useShallow((store) => store.selectedImageItemList))

  const { activeImageItem, setActiveImageItem, appendImageItemList, deleteImageItem } = useCameraWatermarkStore(
    useShallow((state) => ({
      activeImageItem: state.activeImageItem,
      appendImageItemList: state.appendImageItemList,
      deleteImageItem: state.deleteImageItem,
      setActiveImageItem: state.setActiveImageItem,
    })),
  )

  const handleActiveImageItemChange = useCallback<ImageSelectorProps['onActiveImageItemChange']>(
    (imageItem) => {
      setActiveImageItem(imageItem)
    },
    [setActiveImageItem],
  )

  const handleAppendImageItemList = useCallback<ImageSelectorProps['onAppendImageItemList']>(
    (imageItemList) => {
      appendImageItemList(imageItemList)
    },
    [appendImageItemList],
  )

  const handleDeleteImageItem = useCallback<ImageSelectorProps['onDeleteImageItem']>(
    (imageItem) => {
      deleteImageItem(imageItem)
    },
    [deleteImageItem],
  )

  return {
    activeImageItem,
    selectedImageItemList,
    handleActiveImageItemChange,
    handleAppendImageItemList,
    handleDeleteImageItem,
  }
}
