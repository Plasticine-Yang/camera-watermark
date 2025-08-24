import { isImageItemEqual } from '@/helpers'
import { SliceCreatorWithImmer } from '@/store/types'

import { INITIAL_IMAGE_SELECTOR_SLICE_STATE } from './constants'
import { ImageSelectorSlice } from './types'

export const createImageSelectorSlice: SliceCreatorWithImmer<ImageSelectorSlice, ImageSelectorSlice> = (set) => {
  return {
    ...INITIAL_IMAGE_SELECTOR_SLICE_STATE,

    setActiveImageItem: (imageItem) =>
      set((prevState) => {
        prevState.activeImageItem = imageItem
      }),

    appendImageItemList: (imageItemList) =>
      set((prevState) => {
        // 对 imageItemList by filePath 去重后再 append
        const uniqueImageItemList = imageItemList.filter(
          (item) => !prevState.selectedImageItemList.some((prevItem) => prevItem.filePath === item.filePath),
        )
        prevState.selectedImageItemList.push(...uniqueImageItemList)
      }),

    deleteImageItem: (imageItem) =>
      set((prevState) => {
        if (prevState.activeImageItem && isImageItemEqual(prevState.activeImageItem, imageItem)) {
          prevState.activeImageItem = null
        }

        prevState.selectedImageItemList = prevState.selectedImageItemList.filter(
          (item) => !isImageItemEqual(item, imageItem),
        )
      }),
  }
}
