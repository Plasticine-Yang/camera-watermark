import { memo, useRef, type FC } from 'react'

import { useRenderCanvas } from './hooks'
import styles from './style.module.scss'
import { ImagePreviewerProps } from './types'

export const ImagePreviewer: FC<ImagePreviewerProps> = memo((props) => {
  const { imageItem } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useRenderCanvas({ canvasRef, imageItem })

  if (!imageItem) {
    return <div className={styles['image-previewer__empty']}>请选择图片</div>
  }

  return (
    <div className={styles['image-previewer']}>
      <canvas ref={canvasRef} className={styles['image-previewer__canvas']} />
      <div className={styles['image-previewer__image_description']}>{imageItem.filePath}</div>
    </div>
  )
})
