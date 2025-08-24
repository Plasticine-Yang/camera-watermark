import { Close } from '@mui/icons-material'
import { clsx } from 'clsx'
import { memo, MouseEventHandler, useCallback, type FC } from 'react'

import styles from './style.module.scss'
import { ImageItemRenderProps } from './types'

export const ImageItemRender: FC<ImageItemRenderProps> = memo((props) => {
  const { isActive, imageItem, onActive, onDelete } = props

  const handleActive = useCallback(() => {
    onActive(imageItem)
  }, [onActive, imageItem])

  const handleDelete = useCallback<MouseEventHandler<SVGSVGElement>>(
    (e) => {
      e.stopPropagation()
      onDelete(imageItem)
    },
    [onDelete, imageItem],
  )

  return (
    <div
      className={clsx(styles['image-item-render'], { [styles['image-item-render--active']]: isActive })}
      onClick={handleActive}
    >
      <img className={styles['image-item-render__img']} src={imageItem.objectUrl} alt={imageItem.filePath} />
      <div className={styles['image-item-render__delete-helper']}>
        <Close sx={{ color: '#ffffff', fontSize: 16 }} onClick={handleDelete} />
      </div>
    </div>
  )
})

export * from './types'
