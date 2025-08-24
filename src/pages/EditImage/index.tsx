import { memo, type FC } from 'react'

import { ImagePreviewer, ImageSelector } from '@/components'

import { useImageSelector } from './hooks'
import styles from './style.module.scss'

interface EditImageProps {}

export const EditImage: FC<EditImageProps> = memo(() => {
  const {
    activeImageItem,
    selectedImageItemList,
    handleActiveImageItemChange,
    handleAppendImageItemList,
    handleDeleteImageItem,
  } = useImageSelector()

  return (
    <div className={styles['edit-image']}>
      <ImagePreviewer />

      <ImageSelector
        activeImageItem={activeImageItem}
        selectedImageItemList={selectedImageItemList}
        onActiveImageItemChange={handleActiveImageItemChange}
        onAppendImageItemList={handleAppendImageItemList}
        onDeleteImageItem={handleDeleteImageItem}
      />
    </div>
  )
})
