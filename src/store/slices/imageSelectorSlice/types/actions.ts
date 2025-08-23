export interface ImageSelectorSliceActions {
  setActiveImageFilePath: (filePath: string) => void
  deleteImageFilePath: (filePath: string) => void
  appendImageFilePath: (filePath: string) => void
}
