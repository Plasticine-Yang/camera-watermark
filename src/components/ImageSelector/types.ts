export interface ImageSelectorProps {
  activeImageFilePath: string
  selectedImageFilePathList: string[]
  onActiveImageFilePathChange: (activeImageFilePath: string) => void
  onAppendImageFilePath: (imageFilePath: string) => void
  onDeleteImageFilePath: (imageFilePath: string) => void
}
