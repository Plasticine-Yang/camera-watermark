import { SliceCreatorWithImmer } from '@/store/types'

import { INITIAL_IMAGE_SELECTOR_SLICE_STATE } from './constants'
import { ImageSelectorSlice } from './types'

export const createImageSelectorSlice: SliceCreatorWithImmer<ImageSelectorSlice, ImageSelectorSlice> = (set) => {
  return {
    ...INITIAL_IMAGE_SELECTOR_SLICE_STATE,

    setActiveImageFilePath: (filePath) =>
      set((prevState) => {
        prevState.activeImageFilePath = filePath
      }),

    appendImageFilePath: (filePath) =>
      set((prevState) => {
        prevState.selectedImageFilePathList.push(filePath)
      }),

    deleteImageFilePath: (filePath) =>
      set((prevState) => {
        prevState.selectedImageFilePathList = prevState.selectedImageFilePathList.filter((item) => item !== filePath)
      }),
  }
}

export * from './constants'
export * from './types'
