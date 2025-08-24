import { Add } from '@mui/icons-material'
import { Button, Stack } from '@mui/material'
import { memo, type FC } from 'react'

import { isImageItemEqual } from '@/helpers'

import { ImageItemRender } from './components'
import { useImageItemRender, useSelectImage } from './hooks'
import styles from './style.module.scss'
import { ImageSelectorProps } from './types'

export const ImageSelector: FC<ImageSelectorProps> = memo((props) => {
  const { activeImageItem, selectedImageItemList, onActiveImageItemChange, onAppendImageItemList, onDeleteImageItem } =
    props

  const { handleActiveImageItem, handleDeleteImageItem } = useImageItemRender({
    onActiveImageItemChange: onActiveImageItemChange,
    onDeleteImageItem: onDeleteImageItem,
  })

  const { handleSelectImage } = useSelectImage({ onAppendImageItemList })

  return (
    <div className={styles['image-selector']}>
      <Stack direction="row" spacing={1}>
        {selectedImageItemList.map((imageItem) => {
          const isActive = activeImageItem === null ? false : isImageItemEqual(imageItem, activeImageItem)

          return (
            <ImageItemRender
              key={imageItem.filePath}
              isActive={isActive}
              imageItem={imageItem}
              onActive={handleActiveImageItem}
              onDelete={handleDeleteImageItem}
            />
          )
        })}
      </Stack>

      <Button
        aria-label="add image"
        variant="contained"
        className={styles['image-selector__add-icon']}
        onClick={handleSelectImage}
      >
        <Add sx={{ color: '#ffffff' }} />
      </Button>
    </div>
  )
})

export * from './types'
