import { readFile } from '@tauri-apps/plugin-fs'
import { useCallback, useEffect, useState } from 'react'

import { ImageItemRenderProps } from '../types'

type UseThumbnailProps = Pick<ImageItemRenderProps, 'imageItem'>

export function useThumbnail(props: UseThumbnailProps) {
  const { imageItem } = props

  const [thumbnailUrl, setThumbnailUrl] = useState('')

  const readImageItemFilePath = useCallback(
    async (filePath: string) => {
      const fileContents = await readFile(filePath)
      const blob = new Blob([fileContents])
      const objectUrl = URL.createObjectURL(blob)

      setThumbnailUrl(objectUrl)
    },
    [setThumbnailUrl],
  )

  useEffect(() => {
    if (!imageItem.filePath) {
      return
    }

    readImageItemFilePath(imageItem.filePath)
  }, [imageItem.filePath, readImageItemFilePath])

  return { thumbnailUrl }
}
