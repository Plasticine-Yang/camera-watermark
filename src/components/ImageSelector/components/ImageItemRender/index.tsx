import { Close } from '@mui/icons-material'
import { clsx } from 'clsx'
import { memo, useCallback, type FC } from 'react'

import { useThumbnail } from './hooks'
import styles from './style.module.scss'
import { ImageItemRenderProps } from './types'

export const ImageItemRender: FC<ImageItemRenderProps> = memo((props) => {
  const { isActive, imageItem, onActive, onDelete } = props

  const { thumbnailUrl } = useThumbnail({ imageItem })

  const handleActive = useCallback(() => {
    onActive(imageItem)
  }, [onActive, imageItem])

  const handleDelete = useCallback(() => {
    onDelete(imageItem)
  }, [onDelete, imageItem])

  return (
    <div
      className={clsx(styles['image-item-render'], { [styles['image-item-render--active']]: isActive })}
      onClick={handleActive}
    >
      <img className={styles['image-item-render__img']} src={thumbnailUrl} alt={imageItem.filePath} />
      <div className={styles['image-item-render__delete-helper']}>
        <Close sx={{ color: '#ffffff', fontSize: 16 }} onClick={handleDelete} />
      </div>
    </div>
  )
})
