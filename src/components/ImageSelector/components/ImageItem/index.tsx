import { memo, useCallback, type FC } from 'react'

export interface ImageItemProps {
  isActive: boolean
  imageFilePath: string
  onActive: (imageFilePath: string) => void
  onDelete: (imageFilePath: string) => void
}

export const ImageItem: FC<ImageItemProps> = memo((props) => {
  const { isActive, imageFilePath, onActive, onDelete } = props

  const handleActive = useCallback(() => {
    onActive(imageFilePath)
  }, [onActive, imageFilePath])

  const handleDelete = useCallback(() => {
    onDelete(imageFilePath)
  }, [onDelete, imageFilePath])

  return (
    <div style={{ border: isActive ? '2px solid red' : '1px solid #ccc' }} onClick={handleActive}>
      <img src={imageFilePath} alt="" />
      <button onClick={handleDelete}>delete</button>
    </div>
  )
})
