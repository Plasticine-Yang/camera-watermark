import { memo, type FC } from 'react'

import { ImagePreviewer, ImageSelector } from '@/components'

import { useImageSelectorProps } from './hooks'

interface EditImagePcProps {}

export const EditImagePc: FC<EditImagePcProps> = memo(() => {
  const {
    activeImageFilePath,
    selectedImageFilePathList,
    handleActiveImageFilePathChange,
    handleAppendImageFilePath,
    handleDeleteImageFilePath,
  } = useImageSelectorProps()

  return (
    <div>
      <ImagePreviewer />

      <ImageSelector
        activeImageFilePath={activeImageFilePath}
        selectedImageFilePathList={selectedImageFilePathList}
        onActiveImageFilePathChange={handleActiveImageFilePathChange}
        onAppendImageFilePath={handleAppendImageFilePath}
        onDeleteImageFilePath={handleDeleteImageFilePath}
      />
    </div>
  )
})
