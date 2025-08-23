import { memo, type FC } from 'react'

import { ImageItem } from './components'
import { useImageItem } from './hooks'
import { ImageSelectorProps } from './types'

export const ImageSelector: FC<ImageSelectorProps> = memo((props) => {
  const { activeImageFilePath, selectedImageFilePathList, onActiveImageFilePathChange, onDeleteImageFilePath } = props

  const { handleActiveImageItem, handleDeleteImageItem } = useImageItem({
    onActiveImageFilePathChange,
    onDeleteImageFilePath,
  })

  return (
    <div>
      {selectedImageFilePathList.map((imageFilePath) => (
        <ImageItem
          key={imageFilePath}
          isActive={imageFilePath === activeImageFilePath}
          imageFilePath={imageFilePath}
          onActive={handleActiveImageItem}
          onDelete={handleDeleteImageItem}
        />
      ))}

      <button>add image</button>
    </div>
  )
})

export * from './types'
